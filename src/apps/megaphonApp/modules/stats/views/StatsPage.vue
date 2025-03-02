<template>
  <section class="stats-page flex column gap10 width-all">
    <h2>{{$t('statsLocales.stats')}}</h2>
    <div class="statistics-filter flex column gap10">
      <div class="flex align-center gap10 wrap">
        <button class="btn" @click="setTimeToNow(now - 1000*60*60*24*1  )">{{$t('statsLocales.last24Hr')}}</button>
        <button class="btn" @click="setTimeToNow(now - 1000*60*60*24*7  )">{{$t('statsLocales.last7Days')}}</button>
        <button class="btn" @click="setTimeToNow(now - 1000*60*60*24*30 )">{{$t('statsLocales.lastMonth')}}</button>
        <button class="btn" @click="setTimeToNow(now - 1000*60*60*24*365)">{{$t('statsLocales.lastYear')}}</button>
      </div>
      <FormInput type="date" label="statsLocales.fromDate" v-model="datesRange.from"/>
      <FormInput type="date" label="statsLocales.toDate" v-model="datesRange.to"/>
    </div>
    <hr/>
    <div class="flex column gap10">
      <h3>{{$t('statsLocales.watchesPerRelease')}}</h3>
      <ToggleBtns v-model="watchBarChartMode" :options="[{ label: $t('statsLocales.numberOfAccountsWatched'), value: 'byAccount' }, { label: $t('statsLocales.byTotalWatchTimes'), value: 'byTotalWatchTimes' }]"/>
      <BarChart
        :style="{ height: '500px' }"
        chart-id="stats-chart"
        dataset-id-key="datasetIdKey"
        :chart-options="{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                title: function(tooltipItems) {
                  // Custom hover labels
                  const hoverLabels = Object.keys(watchLogsBarChartDataToShow);
                  return hoverLabels[tooltipItems[0].dataIndex];
                }
              }
            }
          }
        }"
        :chart-data="{
          labels: Object.keys(watchLogsBarChartDataToShow).map(c => cropText(c, 10)),
          datasets: [
            {
              label: '',
              backgroundColor: [selectedTheme.colors?.[4] || '#00D8FF'],
              data: Object.values(watchLogsBarChartDataToShow).map(c => c.length)
            }
          ]
        }"
      />
    </div>
    <hr/>
    <div class="flex column gap10">
      <h3>{{$t('statsLocales.watchesPerMonth')}}</h3>
      <ToggleBtns v-model="monthBarMode" :options="[{ label: $t('statsLocales.totalWatchsCount'), value: 'amount' }, { label: $t('statsLocales.totalWatchTime'), value: 'time' }]"/>
      <BarChart
        :style="{ height: '500px' }"
        chart-id="stats-chart"
        dataset-id-key="datasetIdKey"
        :chart-options="{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          }
        }"
        :chart-data="{
          labels: Object.keys(logsMapedByMonths),
          datasets: [
            {
              label: '',
              backgroundColor: [selectedTheme.colors?.[4] || '#00D8FF'],
              data: monthBarMode === 'amount'
                  ? Object.values(logsMapedByMonths).map(c => c.length)
                  : Object.values(logsMapedByMonths).map(c => c.reduce((acc, _) => acc + getTotalTimeWatchedPerVideoWatchLog(_), 0)).map(c => c/1000/60/60)
            }
          ]
        }"
      />
    </div>
    <hr/>
    <ReportList/>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
import Tooltip from '../../../../common/modules/common/cmps/Tooltip.vue';

import { fileService, getTotalTimeWatchedPerVideoWatchLog } from '@/apps/common/modules/common/services/file.service';

import ReportList from '../cmps/ReportList.vue';
import { Pie as PieChart, Bar as BarChart } from 'vue-chartjs';
import { mapItemsBy, Time } from '../../../../common/modules/common/services/util.service';
import { cropText } from '@/apps/common/modules/common/services/util.service';
import ToggleBtns from '../../../../common/modules/common/cmps/ToggleBtns.vue';

export default {
  name: 'StatsPage',
  data() {
    return {
      now: Date.now(),
      datesRange: {
        from: Date.now() - 1000*60*60*24*365, // year ago
        to: Date.now()
      },
      watchBarChartMode: 'byAccount',
      monthBarMode: 'amount',
      chart1Data: { items: [], total: 0 },
      chart2Data: { items: [], total: 0 },
    }
  },
  created() {
    this.fetchVideoWatchLogsForChart1();
    this.fetchVideoWatchLogsForChart2();
  },
  methods: {
    getTotalTimeWatchedPerVideoWatchLog,
    cropText,
    async fetchVideoWatchLogsForChart1() {
      const filterBy = { 
        addAditionalData: true,
        pagination: { noLimit: true },
        filter: {
          datesRange: this.datesRange,
          params: {
            organizationId: this.organizationId
          }
        }
      };
      this.chart1Data = await this.$store.dispatch({ type: 'videoWatchLog/loadItems', filterBy, dontSet: true });
    },
    async fetchVideoWatchLogsForChart2() {
      const filterBy = { 
        addAditionalData: false,
        pagination: { noLimit: true },
        filter: {
          datesRange: {
            from: Date.now() - 1000*60*60*24*365, // year ago
            to: Date.now()
          },
          params: {
            organizationId: this.organizationId
          }
        }
      };
      this.chart2Data = await this.$store.dispatch({ type: 'videoWatchLog/loadItems', filterBy, dontSet: true });
    },
    setTimeToNow(time) {
      this.datesRange = { to: this.now, from: time } 
    }
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    filterBy() {
      return this.$store.getters['stats/filterBy'];
    },
    isLoading() {
      return this.$store.getters['stats/isLoading'] || this.$store.getters['videoWatchLog/isLoading'];
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },
    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    },

    // videoWatchLogData() {
    //   return this.$store.getters['videoWatchLog/data'];
    // },

    onlyRelevantWatchItems() {
      return this.chart1Data.items.filter(fileService.fileUtilsService.checkIfLogCounts);
    },
    watchLogsMapedByFile() {
      return mapItemsBy(this.onlyRelevantWatchItems, 'releaseData.title');
    },
    watchLogsMapedByFileAndOneWatchPerAccount() {
      const res = {};
      for (let key in this.watchLogsMapedByFile) {
        res[key] = Array.from(new Set(this.watchLogsMapedByFile[key].map(c => c.accountId)));
      }
      return res;
    },
    watchLogsBarChartDataToShow() {
      return this.watchBarChartMode === 'byTotalWatchTimes' ? this.watchLogsMapedByFile : this.watchLogsMapedByFileAndOneWatchPerAccount;
    },

    logsMapedByMonths() {
      return Time.mapByTime(this.chart2Data.items.filter(fileService.fileUtilsService.checkIfLogCounts), '_createdAt', 'month/year');
    }

  },
  watch: {
    organizationId() {
    },
    datesRange: {
      deep: true,
      handler() {
        this.fetchVideoWatchLogsForChart1();
      }
    }
  },
  components: { Loader, FormInput, Tooltip, ReportList, BarChart, PieChart, ToggleBtns }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .stats-page {
    padding: rem(20px) 0;
    hr {
      background-color: var(--clr-3);
      border: 1px solid var(--clr-3);
      height: 1px;
      width: 100%;
    }

    .toggle-btns {
      width: fit-content;
      button {
        background-color: var(--clr-0);
        color: var(--clr-1) !important;
        font-weight: normal !important;
        &.selected {
          background-color: var(--clr-4);
          color: var(--clr-0) !important;
        }
      }
    }
  }
}
</style>
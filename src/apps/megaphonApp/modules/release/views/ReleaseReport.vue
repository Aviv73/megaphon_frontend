<template>
  <div class="release-report container flex column gap20 width-all" v-if="release">
    <template v-if="report">
      <div class="flex align-center space-between gap10 width-all">
        <h2>{{$t('distribute.report')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
      </div>
      <div class="main-section flex gap30 width-all">
        <div class="flex column gap10">
          <div class="table-like-list flex-1">
            <div class="table-item-preview gap10 table-header flex space-between">
              <p class="flex-1">{{$t('date')}}</p>
              <p class="flex-2">{{$t('contact.contactName')}} / {{$t('distribute.token')}}</p>
              <p class="flex-1">{{$t('distribute.origin')}}</p>
              <!-- <p>{{$t('email')}}</p> -->
              <p class="flex-1">{{$t('distribute.newsletter')}}</p>
              <p class="flex-1">{{$t('distribute.wached')}}</p>
              <p class="flex-1">{{$t('distribute.wachedCount')}}</p>
              <p class="flex-1">{{$t('distribute.unsubscribed')}}</p>
            </div>
            <div v-for="contact in contactsToShow" :key="contact._id" class="table-item-preview gap10 flex align-center space-between">
              <p class="flex-1">{{pretyDate(contact.activity.distributedAt)}}</p>
              <p class="flex-2">{{contact.name || (contact.firstName && (contact.firstName + ' ' + contact.lastName)) || contact.email || contact.token || ''}}</p>
              <p class="flex-1">{{$t(`distribute.origins.${contact.origin}`)}}</p>
              <!-- <p>{{contact.email}}</p> -->
              <p class="flex-1">{{vOrX(contact.activity.openedNewsAt)}}</p>
              <p class="flex-1">{{vOrX(contact.activity.openedLandingPageAt)}}</p>
              <p class="flex-1">{{contact.activity.openLandingPageCount || (contact.activity.openedLandingPageAt? 1 : '-')}}</p>
              <p class="flex-1">{{vOrX(contact.activity.unsubscribedAt)}}</p>
            </div>
          </div>
          <PaginationBtns :perPage="15" :total="report.recipients.length" @filtered="val => contactFilter = JSON.parse(JSON.stringify(val))" v-model="contactFilter.pagination.page" />
        </div>
        <div class="flex column gap30">
          <ReleaseDistributionLinkCoppier :release="release" :organization="organization"/>
          <h2>{{$t('distribute.enterenceOrigins')}}</h2>
          <PieChart
            chart-id="report-chart"
            dataset-id-key="datasetIdKey"
            :style="{ width: '200px', height: '200px', margin: '0 auto' }"
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
              labels: Object.keys(originsMap).map(key => $t(`distribute.origins.${key}`)),
              datasets: [
                {
                  backgroundColor: chartClrs,
                  data: Object.values(originsMap)
                }
              ]
            }"
          />
          <div class="data-info flex column gap5">
            <div v-for="(key, idx) in Object.keys(originsMap)" :key="key">
              <span :style="{backgroundColor: chartClrs[idx]}"></span> {{$t(`distribute.origins.${key}`)}} - {{originsMap[key]}}
            </div>
          </div>
          <hr/>
          <div class="data-info flex column gap5">
              <p>{{$t('distribute.wached')}}: {{activityMap.landing}}</p>
              <p>{{$t('distribute.newsOpened')}}: {{activityMap.news}}</p>
          </div>
          <hr/>
          <!-- <pre>{{activityMap}}</pre> -->
        </div>
      </div>
    </template>
    <div class="flex wrap gap30" v-else>
      <h2>{{$t('distribute.noDistributionDataForRelease')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
      <ReleaseDistributionLinkCoppier :release="release" :organization="organization"/>
    </div>

    <!-- <pre>{{report}}</pre> -->
  </div>
</template>

<script>
import PaginationBtns from '../../../../common/modules/common/cmps/ItemSearchList/PaginationBtns.vue';

import { Pie as PieChart } from 'vue-chartjs';
import ReleaseDistributionLinkCoppier from '../cmps/ReleaseDistributionLinkCoppier.vue';

export default {
  components: { PaginationBtns, PieChart, ReleaseDistributionLinkCoppier },
  name: 'ReleaseReport',
  data() {
    return {
      contactFilter: {
        pagination: {
          page: 0,
          limit: 15,
        }
      },
      chartClrs: ['#41B883', '#E46651', '#00D8FF', '#DD1B16']
    }
  },
  methods: {
    pretyDate(timeMs) {
      const time = new Date(timeMs);
      return `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
    },
    vOrX(val) {
      return val? '✔' : '-'; // ✓ ✔
    },
    getOrg() {
      this.$store.dispatch({ type: 'organization/loadItem', id: this.orgId });
    },
    getRelease() {
      this.$store.dispatch({ type: 'release/loadItem', id: this.releaseId, organizationId: this.$route.params.organizationId });
    },
    getReport() {
      this.$store.dispatch({ type: 'release/loadReport', releaseId: this.releaseId });
    },
    init() {
      this.getOrg();
      this.getRelease();
      this.getReport();
    }
  },
  computed: {
    releaseId() {
      return this.$route.params.id;
    },
    orgId() {
      return this.$route.params.organizationId;
    },
    release() {
      return this.$store.getters['release/selectedItem'];
    },
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    report() {
      return this.$store.getters['release/selectedReleaseReport'];
    },
    contactsToShow() {
      const filter = this.contactFilter.pagination;
      const startIdx = filter.page * filter.limit;
      return this.report.recipients.slice(startIdx, startIdx+filter.limit);
    },
    originsMap() {
      return this.report.recipients.reduce((acc, c) => {
        return {
          ...acc,
          [c.origin]: acc[c.origin]? acc[c.origin] + 1 : 1
        };
      }, {});
    },
    activityMap() {
      return this.report.recipients.reduce((acc, c) => {
        const activities = c.activity;
        if (activities.openedNewsAt) acc.news += 1;
        if (activities.openedLandingPageAt) acc.landing += 1;
        if (activities.unsubscribedAt) acc.unsubscribe += 1;
        return acc;
      }, { news: 0, landing: 0, unsubscribe: 0 });
    },
  },
  created() {
    this.init();
  },
  watch: {
    '$route.params.id'() {
      this.init();
    }
  }
}
</script>
    
<style lang="scss">
@import '@/assets/styles/global/index';
.release-report {
  padding-top: em(20px);
  .main-section {
    >:first-child {
      flex: 2;
    }
    >:nth-child(2) {
      flex: 1;
    }
  }
  hr {
    border: 1px solid rgba(128, 128, 128, 0.5);
    background: rgba(128, 128, 128, 0.5);
    // padding-bottom: em(20px);
    width: 90%;
    // height: 2px;
  }
  .data-info {
    font-size: em(30px);
    span {
      display: inline-block;
      height: em(9px);
      width: em(9px);
    }
  }
}
</style>
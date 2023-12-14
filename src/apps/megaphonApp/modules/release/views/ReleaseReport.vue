<template>
  <div class="release-report container flex column gap10 width-all" v-if="release && report">
    <div class="flex align-center space-between gap10 width-all">
      <h2>{{$t('distribute.report')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
    </div>
    <div class="flex gap10 width-all">
      <div class="flex column gap10 flex-1">
        <div class="table-like-list flex-1">
          <div class="table-item-preview gap10 table-header flex space-between">
            <p>{{$t('date')}}</p>
            <p>{{$t('contact.contactName')}}</p>
            <!-- <p>{{$t('email')}}</p> -->
            <p>{{$t('distribute.wached')}}</p>
            <p>{{$t('distribute.newsletter')}}</p>
          </div>
          <div v-for="contact in contactsToShow" :key="contact._id" class="table-item-preview gap10 flex align-center space-between">
            <p>{{pretyDate(contact.activity.distributedAt)}}</p>
            <p>{{contact.name || (contact.firstName && (contact.firstName + ' ' + contact.lastName)) || contact.email || ''}}</p>
            <!-- <p>{{contact.email}}</p> -->
            <p>{{vOrX(contact.activity.openedLandingPageAt)}}</p>
            <p>{{vOrX(contact.activity.openedNewsAt)}}</p>
          </div>
        </div>
        <PaginationBtns :perPage="15" :total="report.recipients.length" @filtered="val => contactFilter = JSON.parse(JSON.stringify(val))" v-model="contactFilter.pagination.page" />
      </div>
      <div class="flex column gap30 flex-1">
        <h2>{{$t('distribute.enterenceOrigins')}}</h2>
        <PieChart
          chart-id="report-chart"
          dataset-id-key="datasetIdKey"
          :width="400"
          :height="400"
          :chart-options="{
            responsive: true,
            maintainAspectRatio: false
          }"
          :chart-data="{
            labels: Object.keys(originsMap),
            datasets: Object.values(originsMap),
            datasets: [
              {
                backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                data:Object.values(originsMap)
              }
            ]
          }"
        />
        <pre>{{originsMap}}</pre>
      </div>
    </div>
    <!-- <pre>{{report}}</pre> -->
  </div>
</template>

<script>
import PaginationBtns from '../../../../common/modules/common/cmps/ItemSearchList/PaginationBtns.vue';

import { Pie as PieChart } from 'vue-chartjs';

export default {
  components: { PaginationBtns, PieChart },
  name: 'ReleaseReport',
  data() {
    return {
      contactFilter: {
        pagination: {
          page: 0,
          limit: 15,
        }
      }
    }
  },
  methods: {
    pretyDate(timeMs) {
      const time = new Date(timeMs);
      return `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
    },
    vOrX(val) {
      return val? 'V' : 'X';
    },
    getRelease() {
      this.$store.dispatch({ type: 'release/loadItem', id: this.releaseId });
    },
    getReport() {
      this.$store.dispatch({ type: 'release/loadReport', releaseId: this.releaseId });
    },
    init() {
      this.getRelease();
      this.getReport();
    }
  },
  computed: {
    releaseId() {
      return this.$route.params.id;
    },
    release() {
      return this.$store.getters['release/selectedItem'];
    },
    report() {
      console.log(this.$store.getters['release/selectedReleaseReport']);
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
    }
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
}
</style>
<template>
  <div class="release-report container flex column gap20 width-all" v-if="release">
    <template v-if="report">
      <div class="flex align-center space-between gap10 width-all">
        <h2>{{$t('distributeLocales.report')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
        <button @click="onRemoveDistributionData" class="btn big secondary">{{$t('distributeLocales.deleteDistributionData')}}</button>
      </div>
      <div class="main-section flex gap30 width-all">
        <div class="flex column gap10">
          <div class="table-like-list flex-1">
            <div class="table-item-preview gap10 table-header flex space-between">
              <p class="flex-1 wide-screen-item" :class="{selected: sortContactsKeys[0] === 'activity.distributedAt'}" @click="setContactsSorter('activity.distributedAt')">{{$t('date')}}</p>
              <p class="flex-2" :class="{selected: sortContactsKeys[0] === 'name'}" @click="setContactsSorter('name', 'firstName', 'email', 'token')">{{$t('contactLocales.contactName')}} / {{$t('distributeLocales.token')}}</p>
              <p class="flex-1 wide-screen-item" :class="{selected: sortContactsKeys[0] === 'origin'}" @click="setContactsSorter('origin')">{{$t('distributeLocales.origin')}}</p>
              <!-- <p>{{$t('email')}}</p> -->
              <p class="flex-1 wide-screen-item" :class="{selected: sortContactsKeys[0] === 'openedNews'}" @click="setContactsSorter('openedNews')">{{$t('distributeLocales.newsOpened')}}</p>
              <p class="flex-1" :class="{selected: sortContactsKeys[0] === 'openedLandingPage'}" @click="setContactsSorter('openedLandingPage')">{{$t('distributeLocales.wached')}}</p>
              <!-- <p class="flex-1 wide-screen-item" :class="{selected: sortContactsKeys[0] === 'activity.openLandingPageCount'}" @click="setContactsSorter('activity.openLandingPageCount')">{{$t('distributeLocales.wachedCount')}}</p> -->
              <p class="flex-1 wide-screen-item" :class="{selected: sortContactsKeys[0] === 'watchCount'}" @click="setContactsSorter('watchCount')">{{$t('distributeLocales.wachedCount')}}</p>
              <p class="flex-1 wide-screen-item" :class="{selected: sortContactsKeys[0] === 'activity.unsubscribedAt'}" @click="setContactsSorter('activity.unsubscribedAt')">{{$t('distributeLocales.unsubscribed')}}</p>
              <div class="flex-1">{{$t('distributeLocales.contactReport')}}</div>
            </div>
            <div
              v-for="(contact, idx) in currPageToShow" :key="idx"
              class="table-item-preview gap10 flex align-center space-between"
              :to="{ name: 'ContactReportPage', params: {id: contact._id || 'unknown'}, query: {email: contact.email} }"
            >
              <p class="flex-1 wide-screen-item">{{contact.activity?.distributedAt? pretyDate(contact.activity?.distributedAt) : '-'}}</p>
              <p class="flex-2" :title="getContactName(contact)">{{getContactName(contact)}}</p>
              <p class="flex-1 wide-screen-item">{{$t(`distributeLocales.origins.${contact.origin}`)}}</p>
              <!-- <p>{{contact.email}}</p> -->
              <p class="flex-1 wide-screen-item">{{vOrX(contact.activity?.views?.filter(c => c.platform === 'email')?.length)}}</p>
              <!-- <p class="flex-1">{{vOrX(contact.activity?.views?.filter(c => c.platform === 'landingPage')?.length)}}</p> -->
              <p class="flex-1 tooltip-container">
                <Tooltip class="ltr" v-if="contact.activity?.views?.filter(c => c.platform === 'landingPage')?.length">
                  <template v-slot:preview>
                    {{contact.activity?.views?.filter(c => c.platform === 'landingPage')?.length || '-'}}
                  </template>
                  <template v-slot:content>
                    <p v-for="(view, idx) in contact.activity?.views?.filter(c => c.platform === 'landingPage')" :key="view.id">
                      {{idx+1}} - {{pretyDate(view.at)}}
                    </p>
                  </template>
                </Tooltip>
                <template v-else>
                  -
                </template>
              </p>
              <p class="flex-1 wide-screen-item tooltip-container">
                <Tooltip class="ltr" v-if="getVideoWatchLogsByContact(contact).length">
                  <template v-slot:preview>
                    {{getVideoWatchLogsByContact(contact).length || '-'}}
                  </template>
                  <template v-slot:content>
                    <p v-for="(vidLog, idx) in getVideoWatchLogsByContact(contact)" :key="vidLog._id">
                      {{idx+1}} - {{pretyDate(vidLog._createdAt)}} - {{MsToPretyWatchTime(vidLog.totalWatchTime || 0)}}
                    </p>
                  </template>
                </Tooltip>
                <template v-else>
                  -
                </template>
              </p>
              <p class="flex-1 wide-screen-item">{{vOrX(contact.activity?.unsubscribedAt)}}</p>
              <router-link :to="{ name: 'ContactReportPage', params: {id: contact._id || 'unknown'}, query: {email: contact.email} }">
                <div class="img svg-parrent hover-pop" v-html="statsImg"></div>
              </router-link>
            </div>
          </div>
          <PaginationBtns :perPage="15" :total="contactsToShow.length" @filtered="val => contactFilter = JSON.parse(JSON.stringify(val))" v-model="contactFilter.pagination" />
        </div>
        <div class="flex column gap30">
          <ReleaseDistributionLinkCoppier :release="release" :organization="organization"/>
          <h2>{{$t('distributeLocales.enterenceOrigins')}}</h2>
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
              labels: Object.keys(originsMap).map(key => $t(`distributeLocales.origins.${key}`)),
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
              <span :style="{backgroundColor: chartClrs[idx]}"></span> {{$t(`distributeLocales.origins.${key}`)}} - {{originsMap[key]}}
            </div>
          </div>
          <hr/>
          <div class="data-info flex column gap5">
              <p>{{$t('distributeLocales.wached')}}: {{activityMap.landing}}</p>
              <p>{{$t('distributeLocales.newsOpened')}}: {{activityMap.news}}</p>
          </div>
          <hr/>
          <!-- <pre>{{activityMap}}</pre> -->
        </div>
      </div>
    </template>
    <div class="flex wrap gap30" v-else>
      <h2>{{$t('distributeLocales.noDistributionDataForRelease')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
      <ReleaseDistributionLinkCoppier :release="release" :organization="organization"/>
    </div>

    <!-- <pre>{{report}}</pre> -->
  </div>
</template>

<script>
import PaginationBtns from '../../../../common/modules/common/cmps/ItemSearchList/PaginationBtns.vue';

import { Pie as PieChart } from 'vue-chartjs';
import ReleaseDistributionLinkCoppier from '../cmps/ReleaseDistributionLinkCoppier.vue';
import { getDeepVal, Utils, Time } from '../../../../common/modules/common/services/util.service';
import { contactService } from '../../contact/contact.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import Tooltip from '../../../../common/modules/common/cmps/Tooltip.vue';
// import { checkIfLogCounts } from '../../../../common/modules/common/services/file.service';

import  { getSvgs } from '@/apps/megaphonApp/assets/images/svgs.js';


export default {
  components: { PaginationBtns, PieChart, ReleaseDistributionLinkCoppier, Tooltip },
  name: 'ReleaseReport',
  // Time,
  data() {
    return {
      contactFilter: {
        pagination: {
          page: 0,
          limit: 15,
        }
      },
      chartClrs: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      sortContactsKeys: []
    }
  },
  methods: {
    getContactName(contact) {
      return contactService.getContactPreviewName(contact) || contact.token || '';
    },
    setContactsSorter(...sortKeys) {
      this.contactFilter.pagination.page = 0;
      this.sortContactsKeys = [...sortKeys];
    },
    pretyDate: Utils.pretyDate,
    MsToPretyWatchTime: Time.MsToPretyWatchTime,
    vOrX: Utils.vOrX,
    getOrg() {
      this.$store.dispatch({ type: 'organization/loadItem', id: this.orgId });
    },
    getRelease() {
      this.$store.dispatch({ type: 'release/loadItem', id: this.releaseId, organizationId: this.$route.params.organizationId });
    },
    async getReport() {
      await this.$store.dispatch({ type: 'release/loadReport', releaseId: this.releaseId, organizationId: this.$route.params.organizationId });
      console.log('REPORT DATA::', this.report);
    },
    init() {
      this.getOrg();
      this.getRelease();
      this.getReport();
    },

    async onRemoveDistributionData() {
      if (!await alertService.Confirm(this.$t('distributeLocales.alertMsgs.confirmRemoveDistData'))) return;
      await this.$store.dispatch({ type: 'release/removeDistData', releaseId: this.releaseId, organizationId: this.$route.params.organizationId });
      this.$router.push({name: 'ReleasePage', params: {organizationId: this.$route.params.organizationId}});
    },

    getVideoWatchLogsByContact(contact) {
      // return 7;
      const relevantAccount = this.report.relevantAccounts.find(c => c.email === contact.email);
      if (!relevantAccount) return 0;
      const relevantViews = this.report.releaseFiles.reduce((acc, c) => {
        acc.push(...c.videoWatchLogs.filter(log => log.accountId === relevantAccount._id));
        return acc;
      }, []);
      return relevantViews;
      // const actualRelevantWatchLogs = relevantViews.filter(checkIfLogCounts);
      // const actualRelevantWatchLogs = relevantViews.filter(vidLog => {
      //   const vidLength = vidLog.videoSecondsDuration;
      //   if (!vidLength) return true;
      //   if (!vidLog.sections?.length) return false;
      //   const cLogTotalWatchTimeMS = vidLog.sections.reduce((acc, c) => acc + (c.end - c.start), 0);
      //   const cLogTotalWatchTimeSeconds = cLogTotalWatchTimeMS / 1000;
      //   const percentage = cLogTotalWatchTimeSeconds / vidLength;
      //   const minPercentage = 0.1; // means it needs to be at least minPercentage of the video length to count;
      //   return percentage > minPercentage;
      // });
      // return actualRelevantWatchLogs.length;
    }
  },
  computed: {
    statsImg() {
      return getSvgs().navActions.stats;
    },
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
      let res = [...(this.report.recipients || [])];
      res = res.reduce((acc, curr) => {
        if (!acc.find(c => (c.email || this.getContactName(c)) === (curr.email || this.getContactName(curr)))) acc.push(curr);
        return acc;
      }, []);
      res = res.sort((a, b) => {
        // const aKey = this.sortContactsKeys.find(key => getDeepVal(a, key));
        // const bKey = this.sortContactsKeys.find(key => getDeepVal(b, key));
        // if (!aKey && !bKey) return 0;
        const sortKey = this.sortContactsKeys[0];
        // const [aKey, bKey] = [this.sortContactsKeys[0], this.sortContactsKeys[0]];
        let aVal = getDeepVal(a, sortKey);
        let bVal = getDeepVal(b, sortKey);
        if (sortKey === 'watchCount') {
          aVal = this.getVideoWatchLogsByContact(a).length;
          bVal = this.getVideoWatchLogsByContact(b).length;
        }
        if (sortKey === 'openedLandingPage') {
          aVal = a.activity.views?.filter(c => c.platform === 'landingPage')?.length || 0;
          bVal = b.activity.views?.filter(c => c.platform === 'landingPage')?.length || 0;
        }
        if (sortKey === 'openedNews') {
          aVal = a.activity.views?.filter(c => c.platform === 'email')?.length || 0;
          bVal = b.activity.views?.filter(c => c.platform === 'email')?.length || 0;
        }
        if (aVal === bVal) return 0;
        if (!aVal) return 1;
        if (!bVal) return -1;
        // if (!aKey || !aVal) return 1;
        // if (!bKey || !bVal) return -1;
        return aVal > bVal? -1 : 1;
      });
      return res;
    },
    currPageToShow() {
      const filter = this.contactFilter.pagination;
      const startIdx = filter.page * filter.limit;
      return this.contactsToShow.slice(startIdx, startIdx+filter.limit);
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
        if (activities.views?.filter(c => c.platform === 'email')?.length) acc.news += 1;
        if (activities.views?.filter(c => c.platform === 'landingPage')?.length) acc.landing += 1;
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

    @media (max-width: $small-screen-break) {
      flex-direction: column-reverse;
    }
  }
  hr {
    border: 1px solid rgba(128, 128, 128, 0.5);
    background: rgba(128, 128, 128, 0.5);
    // padding-bottom: em(20px);
    width: 90%;
    // height: 2px;
  }
  .tooltip-container {
    overflow: unset !important;
  }
  .data-info {
    font-size: em(30px);
    span {
      display: inline-block;
      height: em(9px);
      width: em(9px);
    }
  }
  .table-header {
    p {
      cursor: pointer;
    }
    .selected {
      font-weight: bold;
    }
  }
}
</style>
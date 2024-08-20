<template>
  <div class="app streamTv-app">
    <div class="app-content container_">
      <AppAside class="left wide-screen-item" v-if="!(['LoginPage', 'SignupPage'].includes($route.name) || isSimpleReleasePage)"/>
      <div class="right">
        <AppHeader/>
        <main class="app-main">
          <router-view class="main-content"/>
        </main>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import './assets/style/index.scss';

import AppHeader from './cmps/streamTv_AppHeader.vue';
import AppFooter from './cmps/streamTv_AppFooter.vue';
import AppAside from './cmps/streamTv_AppAside.vue';
import { templateUtils } from '../../common/modules/common/services/template.util.service';

// import { setStylingForOrgTheme } from '@/apps/common/modules/common/services/dynamicPages.service.js';

export default {
  name: 'streamTvApp',
  components: {
    AppHeader,
    AppFooter,
    AppAside
  },
  computed: {
    org() {
      return this.$store.getters['organization/selectedItem'];
    },
    isSimpleReleasePage() {
      if (this.$route.name !== 'ReleaseDetails') return false;
      console.log(!this.$store.getters['release/selectedItem']?.releaseData?.childrenReleases)
      return !this.$store.getters['release/selectedItem']?.releaseData?.childrenReleases;
    }
  },
  methods: {
    async loadOrg() {
      await this.$store.dispatch({type: 'organization/loadItem'});
    },
    // async setOrgStyling() {
    //   setStylingForOrgTheme(this.org, '.streamTv-app', true);
    // },

    
    async loadArchive() {
      // await delay(2000);
      // TODO; LOAD ALL GROUP RELEASES INSTREAD;
      const orgFilter = this.org.routes.find(c => c.type === 'archive')?.releaseFilter || {
        "releaseTypes" : templateUtils.getAllReleaseTypesForOrg(this.org).filter(c => c.isGroup).map(c => c.id)
      }
      const archiveReleases = await this.$store.dispatch({ type: 'release/loadItems', filterBy_: {}, organizationId: this.org._id, orgFilter });
      this.$store.commit({ type: 'release/setArchiveReleases', releases: archiveReleases });
    }
  },
  async created() {
    this.$store.dispatch('auth/getUserInfo')
    await this.loadOrg();
    // this.setOrgStyling();
    this.loadArchive();
  }
}
</script>

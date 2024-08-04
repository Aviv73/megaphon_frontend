<template>
  <div class="app streamTv-app">
    <div class="app-content container_">
      <AppAside class="left wide-screen-item" v-if="!['LoginPage', 'SignupPage'].includes($route.name)"/>
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

import { setDynamicStylingEl } from '@/apps/common/modules/common/services/dynamicPages.service.js';

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
    }
  },
  methods: {
    async loadOrg() {
      await this.$store.dispatch({type: 'organization/loadItem'});
    },
    async setOrgStyling() {
      setDynamicStylingEl(this.org, '.streamTv-app');
    },

    
    async loadArchive() {
      // await delay(2000);
      const archiveReleases = await this.$store.dispatch({ type: 'release/loadItems', filterBy_: {}, organizationId: this.org._id, orgFilter: this.org.routes.find(c => c.id === 'ID-20BE-190DEC6AD7F-1383')?.releaseFilter });
      this.$store.commit({ type: 'release/setArchiveReleases', releases: archiveReleases });
    }
  },
  async created() {
    this.$store.dispatch('auth/getUserInfo')
    await this.loadOrg();
    this.setOrgStyling();
    this.loadArchive();
  }
}
</script>

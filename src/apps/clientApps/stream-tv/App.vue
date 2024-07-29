<template>
  <div class="app streamTv-app">
    <div class="app-content container_">
      <AppAside class="left"/>
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
  methods: {
    async setOrgStyling() {
      const org = await this.$store.dispatch({type: 'organization/loadItem'});
      setDynamicStylingEl(org, '.streamTv-app');
    }
  },
  created() {
    this.setOrgStyling();
  }
}
</script>

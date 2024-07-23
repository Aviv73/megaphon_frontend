<template>
  <div class="app cellcomTv-app">
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

import AppHeader from './cmps/cellcomTv_AppHeader.vue';
import AppFooter from './cmps/cellcomTv_AppFooter.vue';
import AppAside from './cmps/cellcomTv_AppAside.vue';

import { setDynamicStylingEl } from '@/apps/common/modules/common/services/dynamicPages.service.js';


export default {
  name: 'cellcomTvApp',
  components: {
    AppHeader,
    AppFooter,
    AppAside
  },
  methods: {
    async setOrgStyling() {
      const org = await this.$store.dispatch({type: 'organization/loadItem'});
      setDynamicStylingEl(org, '.cellcomTv-app');
    }
  },
  created() {
    this.setOrgStyling();
  }
}
</script>

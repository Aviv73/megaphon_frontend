<template>
  <div class="app defaultApp">
    <div class="app-content">
      <!-- <AppAside/> -->
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

import AppHeader from './cmps/default_AppHeader.vue';
import AppFooter from './cmps/default_AppFooter.vue';

// import { setStylingForOrgTheme } from '@/apps/common/modules/common/services/dynamicPages.service.js';


export default {
  name: 'DefaultClientApp',
  components: {
    AppHeader,
    AppFooter,
    // AppAside
  },
  // methods: {
  //   async setOrgStyling() {
  //     const org = await this.$store.dispatch({type: 'organization/loadItem'});
  //     setStylingForOrgTheme(org, '.defaultApp', true);
  //   }
  // },
  // created() {
  //   this.setOrgStyling();
  // }
}
</script>

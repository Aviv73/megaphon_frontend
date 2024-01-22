<template>
  <div class="app default-app">
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

import AppHeader from './modules/common/cmps/default_AppHeader.vue';
import AppFooter from './modules/common/cmps/default_AppFooter.vue';

// import { elementService } from '@/apps/common/modules/common/services/element.service.js';
import { elementService } from '../../common/modules/common/services/element.service.js';


export default {
  name: 'DefaultClientApp',
  components: {
    AppHeader,
    AppFooter,
    // AppAside
  },
  methods: {
    async setOrgStyling() {
      const org = await this.$store.dispatch({type: 'organization/loadItem'});
      document.title = org.name;
      const designPreferences = org.designPreferences;
      const colorsPalate = designPreferences?.colorsPalate || [];
      const cssEl = elementService.StyleEl('.default-app', {
        '.app-main': {
          color: colorsPalate[0],
          backgroundColor: colorsPalate[1]
        },
        '.app-header, .app-footer': {
          color: colorsPalate[2],
          backgroundColor: colorsPalate[3]
        },
        'h1, h2, h3, h4, h5, h6': {
          color: colorsPalate[4],
        }
      });
      document.head.appendChild(cssEl);
    }
  },
  created() {
    this.setOrgStyling();
  }
}
</script>

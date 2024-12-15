<template>
  <div class="app megaphon-app _dark-theme height-all" :class="appThemeClassName">
    <div class="app-content">
      <!-- <AppAside/> -->
      <div class="right height-all flex column">
        <AppHeader/>
        <main class="app-main height-all flex-1 flex column">
          <router-view class="main-content width-all flex-1 align-start"/>
        </main>
      </div>
    </div>
    <AppFooter/>
    <!-- <Loader v-if="isLoading"/> -->
  </div>
</template>

<script>
import './assets/style/index.scss';

import AppHeader from './modules/common/cmps/AppHeader.vue';
import AppFooter from './modules/common/cmps/AppFooter.vue';
// import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

import allThemes from './themes';
// import { setDynamicStylingThemeEl } from '../common/modules/common/services/dynamicPages.service.js';

export default {
  name: 'MegaphonApp',
  components: {
    AppHeader,
    AppFooter,
    // AppAside
    // Loader
  },
  computed: {
    uiConfig() {
      return this.$store.getters['settings/uiConfig'] || {};
    },
    appThemeClassName() {
      return (this.uiConfig?.theme || 'none') + '-theme';
    },
  },
  methods: {
    // setTheme() {
    //   const themeName = this.uiConfig.theme;
    //   const themeItem = allThemes.find(c => c.name === themeName) || allThemes[0];
    //   // setDynamicStylingThemeEl({...themeItem, title: 'Megaphon'}, '.app');
    //   this.$store.commit({ type: 'setSelectedTheme', theme: themeItem, selector:  '.app' });
    // }
  },
  created() {
    // this.setTheme();
    // evEmmiter.on('app_config_update', this.setTheme);
  },

  // data() {
  //   return {
  //     isLoading: false,
  //   }
  // },
  // computed: {
  //   loggedUser() {
  //     return this.$store.getters['auth/loggedUser'];
  //   }
  // },
  // methods: {
  //   // async initUser() {
  //   //   if (this.$route.name === 'LoginPage') return;
  //   //   this.isLoading = true;
  //   //   // await socketService.connect();
  //   //   try {
  //   //     await Promise.all([
  //   //       // this.$store.dispatch('settings/loadSettings'),
  //   //       // this.$store.dispatch('settings/loadConfig'),
  //   //       this.$store.dispatch('auth/getUserInfo')
  //   //     ]);
  //   //   } catch(e) {};
  //   //   this.isLoading = false;
  //   //   if (!this.loggedUser) this.$router.push({name: 'LoginPage'});
  //   //   // else {
  //   //   //   if (this.$route.params.organizationId) return;
  //   //   //   const firstOrg = this.loggedUser.organizations.filter(c => c.organizationId != '-1')[0];
  //   //   //   if (!firstOrg) return;
  //   //   //   this.$router.push({name: 'ReleasePage', params: {organizationId: firstOrg.organizationId}});
  //   //   // }
  //   // }
  // },
  // async created() {
  //   // this.initUser();
  // }
}
</script>

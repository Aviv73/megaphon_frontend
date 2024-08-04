<template>
  <div class="app" id="app" :class="{ rtl: isRtl, [appThemeClassName]: true, accessability: isAccessabilityMode }" :style="{'font-size': remSize}">
    <!-- <div class="app-content">
      <AppAside/>
      <div class="right">
        <AppHeader @action="isLoading = true" @endAction="isLoading=false"/>
        <main class="app-main">
          <router-view class="main-content"/>
        </main>
      </div>
    </div>
    <AppFooter/> -->
    <!-- <SelectedApp/> -->
    <component v-if="selectedApp" :is="selectedApp"/>
    <Loader v-if="isLoading" :msg="showSleepMsg? $t('serverSleepsMsg') : ''"/>
  </div>
</template>

<script>
// import AppHeader from '@/apps/common/modules/common/cmps/AppHeader.vue';
// import AppFooter from '@/apps/common/modules/common/cmps/AppFooter.vue';
// import AppAside from '@/apps/common/modules/common/cmps/AppAside.vue';
import { socketService } from '@/apps/common/modules/common/services/socket.service';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';

import appConfig from './appConfig';

// import selectedAppData from './apps/index.js';
import { getSelectedAppData } from './apps/index.js';
import { distributionService } from './apps/megaphonApp/modules/release/services/distribution.service';


import commonStoreModules from './apps/common/store'
import { concatItems } from './apps/common/modules/common/services/util.service';
import { setDynamicStylingEl } from '@/apps/common/modules/common/services/dynamicPages.service.js';

export default {
  name: 'App',
  components: {
    // SelectedApp: selectedAppData.app,
    // AppHeader,
    // AppFooter,
    // AppAside,
    Loader
  },
  data() {
    return {
      isLoading: false,
      showSleepMsg: false,
      selectedAppData: null
    }
  },
  computed: {
    selectedApp() {
      return this.selectedAppData?.app
    },
    uiConfig() {
      return this.$store.getters['settings/uiConfig'];
    },
    appThemeClassName() {
      return ((!appConfig.client && this.uiConfig.theme) || 'none') + '-theme';
    },
    remSize() {
      return ((!appConfig.client && this.uiConfig.remSize) || 16) + 'px';
    },
    isAccessabilityMode() {
      return this.uiConfig.accessabilityMode
    },
    isRtl() {
      const locale = this.$i18n.locale;
      return ['he', 'heF'].includes(locale);
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  async created() {
    await this.initCommonStore();

    this.$store.commit('setIsScreenWide');
    window.addEventListener('resize', () => this.$store.commit('setIsScreenWide'));

    this.displayUiConfig()
    
    evEmmiter.on('app_config_update', this.displayUiConfig);
    evEmmiter.on('set_locale', this.setLocale);


    if (!appConfig.client) {
      await this.initSelectedApp();
      await this.initUser(true);
      return;
    }
    const org = await this.$store.dispatch({type: 'organization/loadItem'});
    await this.initSelectedApp(org);
    setDynamicStylingEl(org, '.'+this.selectedAppData.name);
    // document.title = org.name;
    if (this.selectedAppData?.params?.title) document.title = this.selectedAppData.params.title;
    // this.setOrgStyling(org);

    await this.initUser(org.requireAuth);

    if (this.$route.meta.reportReleaseOpen) {
      const releaseId = this.$route.params[this.$route.meta.releaseIdParamName];
      // const token = this.$route.query.token;
      // const origin = this.$route.query.token;
      distributionService.reportReleaseOpened(releaseId, this.$route.query);
    }

  },
  methods: {
    async initUser(requireAuth = false) {
      if (this.$route.name === 'LoginPage') return;
      this.isLoading = true;
      // await socketService.connect();
      try {
        await Promise.all([
          // this.$store.dispatch('settings/loadSettings'),
          // this.$store.dispatch('settings/loadConfig'),
          this.$store.dispatch('auth/getUserInfo')
        ]);
      } catch(e) {};
      this.isLoading = false;
      if (requireAuth && !this.loggedUser) this.$router.push({name: 'LoginPage'});
      // else {
      //   if (this.$route.params.organizationId) return;
      //   const firstOrg = this.loggedUser.organizations.filter(c => c.organizationId != '-1')[0];
      //   if (!firstOrg) return;
      //   this.$router.push({name: 'ReleasePage', params: {organizationId: firstOrg.organizationId}});
      // }
    },
    setLocale(lang = this.uiConfig.locale) {
      // let locale = this.uiConfig.locale;
      let locale = lang;
      if ((locale === 'he') && (this.loggedUser?.gender === 'female')) locale = 'heF';
      this.$i18n.locale = locale;
    },
    displayUiConfig() {
      if (appConfig.client) this.setLocale('he');
      else this.setLocale('he');
      // else this.setLocale();
      alertService.setConfig({ direction: this.isRtl? 'rtl' : 'ltr' });
      if (appConfig.client) return;
      const config = this.uiConfig;
      alertService.instance.setBtnMsgs({
        confirm: this.$t('confirm'),
        cancel: this.$t('cancel'),
        close: this.$t('close'),
        submit: this.$t('submit'),
      });
      if (config.accessabilityMode) document.querySelector('html').classList.add('accessability');
      else document.querySelector('html').classList.remove('accessability');
    },

    async initCommonStore() {
      for (let moduleName in commonStoreModules) {
        this.$store.registerModule(moduleName, commonStoreModules[moduleName]);
      }
    },
    async initSelectedApp(org) {
      const selectedAppData = getSelectedAppData(org?.clientApp);
      for (let moduleName in selectedAppData.store) {
        if (this.$store.hasModule(moduleName)) {
          await this.$store.unregisterModule(moduleName);
        } 
        this.$store.registerModule(moduleName, selectedAppData.store[moduleName]);
      }
      // init routes::
      selectedAppData.routes.forEach(route => this.$router.addRoute(route));
      // init locales::
      for (let [locale, messages] of Object.entries(selectedAppData.locales)) {
        const existedLocMsgs = this.$i18n.getLocaleMessage(locale) || {};
        this.$i18n.setLocaleMessage(locale, concatItems(existedLocMsgs, messages));
      }

      this.$store.commit({ type: 'setSelectedAppData', selectedAppData});
      this.selectedAppData = selectedAppData;
    }
  }
}
</script>

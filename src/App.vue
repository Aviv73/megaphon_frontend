<template>
  <div class="app" id="app" :class="{ rtl: isRtl, [appThemeClassName]: true, accessability: isAccessabilityMode }" :style="{'font-size_': remSize}">
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
    <Loader v-if="isLoading" :msg="showSleepMsg? $t('serverSleepsMsg') : ''"/>
    <template v-else-if="selectedApp">
      <component :is="selectedApp"/>
      <SecondFactorAuthModal/>
    </template>
  </div>
</template>

<script>
// import AppHeader from '@/apps/common/modules/common/cmps/AppHeader.vue';
// import AppFooter from '@/apps/common/modules/common/cmps/AppFooter.vue';
// import AppAside from '@/apps/common/modules/common/cmps/AppAside.vue';
// import { socketService } from '@/apps/common/modules/common/services/socket.service';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';

import appConfig from './appConfig';

// import selectedAppData from './apps/index.js';
import { getSelectedAppData } from './apps/index.js';
import { distributionService } from './apps/megaphonApp/modules/release/services/distribution.service';


import commonStoreModules from './apps/common/store'
import { Utils } from './apps/common/modules/common/services/util.service';
// import { setStylingForOrgTheme } from '@/apps/common/modules/common/services/dynamicPages.service.js';
import { loadScripts } from './apps/common/modules/common/services/loadScript.service';
import { organizationService } from './apps/megaphonApp/modules/organization/services/organization.service';
import { dynamicCssPagesService } from './apps/common/modules/common/services/dynamicPages.service';
import SecondFactorAuthModal from './apps/common/modules/auth/cmps/SecondFactorAuthModal.vue';

export default {
  name: 'App',
  components: {
    // SelectedApp: selectedAppData.app,
    // AppHeader,
    // AppFooter,
    // AppAside,
    Loader,
    SecondFactorAuthModal
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
      return ((!appConfig.client && this.uiConfig?.theme) || 'none') + '-theme_';
    },
    remSize() {
      return ((!appConfig.client && this.uiConfig?.remSize) || 16) + 'px';
    },
    isAccessabilityMode() {
      return this.uiConfig?.accessabilityMode
    },
    isRtl() {
      const locale = this.$i18n.locale;
      return ['he', 'heF'].includes(locale);
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    org() {
      return this.$store.getters['organization/selectedItem'];
    }
  },
  async created() {
    this.isLoading = true;
    try {
      await loadScripts();
    } catch(err) {
      // alertService.toast({type: 'danger', msg: err?.msg || err?.message || err});
    }
    this.initCommonStore();

    this.$store.commit('setIsScreenWide');
    window.addEventListener('resize', () => this.$store.commit('setIsScreenWide'));

    // this.displayUiConfig();
    
    evEmmiter.on('app_config_update', this.displayUiConfig);
    evEmmiter.on('set_locale', this.setLocale);

    // const on2AuthCb = async (endPoint) => {
    //   // evEmmiter.off('needs_2_factor_auth', on2AuthCb);
    //   try {
    //     if (this.loggedUser) await this.$store.dispatch({ type: 'auth/makeSecondFactorAuthPass' });
    //     const pass = await alertService.Prompt(this.$t('authLocales.required2FactorAthMsg'), this.$t('authLocales.password'));
    //     await this.$store.dispatch({ type: 'auth/finish2FactorAuth', pass });
    //     if (endPoint) this.$router.push(endPoint);
    //     evEmmiter.on('needs_2_factor_auth', on2AuthCb);
    //   } catch(err) {
    //     if (err.needs2FactorAuth) on2AuthCb();
    //     // else evEmmiter.on('needs_2_factor_auth', on2AuthCb);
    //   }
    //   // finally {
    //   //   evEmmiter.on('needs_2_factor_auth', on2AuthCb);
    //   // }
    // }
    // evEmmiter.on('needs_2_factor_auth', on2AuthCb);


    if (!appConfig.client) {
      await this.initSelectedApp();
      if (appConfig.singleOrgMode) {
        appConfig.appOrganization = await this.$store.dispatch({type: 'organization/loadItem', id: appConfig.appOrganizationId, dontSet: true, isToInheritData: true })
        this.$store.commit({ type: 'setRootOrg', org: appConfig.appOrganization, isClient: false });
        // this.$store.commit({ type: 'setSelectedTheme', theme: dynamicCssPagesService.getRelevantThemeForOrg(appConfig.appOrganization, false, this.uiConfig, this.$store.getters.selectedAppData, '.megaphon-app'), selector:  '.megaphon-app' });
        // setStylingForOrgTheme(appConfig.appOrganization, '.megaphon-app');
      }
      // this.setTheme(false);
      await this.initUser(true);
      this.isLoading = false;
      this.displayUiConfig();
      return;
    }
    const org = await this.$store.dispatch({type: 'organization/loadItem'});
    this.$store.commit({ type: 'setRootOrg', org, isClient: true });
    appConfig.appOrganization = org;
    appConfig.appOrganizationId = org?._id;
    await this.initSelectedApp(org);
    // setStylingForOrgTheme(org, '.'+this.selectedAppData.name, true);
    // this.setTheme(true);
    // this.$store.commit({ type: 'setSelectedTheme', theme: dynamicCssPagesService.getRelevantThemeForOrg(appConfig.appOrganization, true, this.uiConfig, this.$store.getters.selectedAppData, '.'+this.selectedAppData.name), selector:  '.'+this.selectedAppData.name });
    // document.title = org.name;
    // if (this.selectedAppData?.params?.title) document.title = this.selectedAppData.params.title;
    // this.setOrgStyling(org);

    await this.initUser(org.requireAuth);
    this.isLoading = false;

    
    this.displayUiConfig();

  },
  methods: {
    setTheme() {
      const isClient = appConfig.client;
      const selector = isClient ? '.'+this.selectedAppData.name : '.megaphon-app';
      this.$store.dispatch({ type: 'setSelectedTheme', theme: dynamicCssPagesService.getRelevantThemeForOrg(appConfig.appOrganization || this.org, isClient, this.uiConfig, this.$store.getters.selectedAppData, selector), selector });
    },

    async initUser(requireAuth = false) {
      if (['LoginPage', 'SignupPage'].includes(this.$route.name)) return;
      if (this.$route.meta.noAuth) return;
      // this.isLoading = true;
      // socketService.connect();
      try {
        await Promise.all([
          // this.$store.dispatch('settings/loadSettings'),
          // this.$store.dispatch('settings/loadConfig'),
          this.$store.dispatch('loadEnvManagment'),
          this.$store.dispatch('auth/getUserInfo')
        ]);
      } catch(e) {};
      // this.isLoading = false;
      if (requireAuth && !this.loggedUser) {
        this.$store.commit({ type: 'auth/redirectPage', endpoint: window?.location?.hash?.split('#')[1] || '' });
        this.$router.push({name: 'LoginPage', query: { endpoint: window?.location?.hash?.split('#')[1] || '' } });
      } else {
        if (this.$route.meta.reportReleaseOpen) {
          const releaseId = this.$route.params[this.$route.meta.releaseIdParamName];
          // const token = this.$route.query.token;
          // const origin = this.$route.query.token;
          distributionService.reportReleaseOpened(releaseId, this.$route.query);
        }
      }
      // else {
      //   if (this.$route.params.organizationId) return;
      //   const firstOrg = this.loggedUser.organizations.filter(c => c.organizationId != '-1')[0];
      //   if (!firstOrg) return;
      //   this.$router.push({name: 'ReleasePage', params: {organizationId: firstOrg.organizationId}});
      // }
    },
    setLocale(lang = this.uiConfig?.locale) {
      // let locale = this.uiConfig.locale;
      let locale = lang;
      if ((locale === 'he') && (this.loggedUser?.gender === 'female')) locale = 'heF';
      this.$i18n.locale = locale;
    },
    displayUiConfig() {
      const config = this.uiConfig;
      if (appConfig.client) this.setLocale('he');
      // else this.setLocale('he');
      else this.setLocale(config.locale || 'he');
      // else this.setLocale();
      alertService.setConfig({ direction: this.isRtl? 'rtl' : 'ltr' });
      // if (appConfig.client) return;
      alertService.instance.setBtnMsgs({
        confirm: this.$t('confirm'),
        cancel: this.$t('cancel'),
        close: this.$t('close'),
        submit: this.$t('submit'),
      });
      if (config?.accessabilityMode) document.querySelector('html').classList.add('accessability');
      else document.querySelector('html').classList.remove('accessability');
      this.setTheme();
    },

    initCommonStore() {
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
        this.$i18n.setLocaleMessage(locale, Utils.concatItems(existedLocMsgs, messages));
      }

      this.$store.commit({ type: 'setSelectedAppData', selectedAppData});
      this.selectedAppData = selectedAppData;
    }
  }
}
</script>

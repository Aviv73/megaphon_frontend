<template>
  <div class="app" id="app" :class="{ rtl: isRtl, [appTheme]: true, accessability: isAccessabilityMode }">
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
    <SelectedApp/>
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

import selectedAppData from './apps/index.js';
import { distributionService } from './apps/megaphonApp/modules/release/services/distribution.service';

export default {
  name: 'App',
  components: {
    SelectedApp: selectedAppData.app,
    // AppHeader,
    // AppFooter,
    // AppAside,
    Loader
  },
  data() {
    return {
      isLoading: false,
      showSleepMsg: false,
    }
  },
  computed: {
    uiConfig() {
      return this.$store.getters['settings/uiConfig'];
    },
    appTheme() {
      return this.uiConfig.theme + '-theme';
    },
    isAccessabilityMode() {
      return this.uiConfig.accessabilityMode
    },
    isRtl() {
      const locale = this.$i18n.locale;
      return ['he', 'heF'].includes(locale);
    }
  },
  async created() {

    this.displayUiConfig()
    
    evEmmiter.on('app_config_update', this.displayUiConfig);

    if (!appConfig.client) {
      return;
    }
    const org = await this.$store.dispatch({type: 'organization/loadItem'});
    document.title = org.name;

    if (this.$route.meta.reportReleaseOpen) {
      const releaseId = this.$route.params[this.$route.meta.releaseIdParamName];
      // const token = this.$route.query.token;
      // const origin = this.$route.query.token;
      distributionService.reportReleaseOpened(releaseId, this.$route.query);
    }

  },
  methods: {
    setLocale() {
      let locale = this.uiConfig.locale;
      if ((locale === 'he') && (this.loggedUser?.gender === 'female')) locale = 'heF';
      this.$i18n.locale = locale;
    },
    displayUiConfig() {
      const config = this.uiConfig;
      this.setLocale();
      alertService.setConfig({ direction: this.isRtl? 'rtl' : 'ltr' });
      alertService.instance.setBtnMsgs({
        confirm: this.$t('confirm'),
        cancel: this.$t('cancel'),
        close: this.$t('close'),
        submit: this.$t('submit'),
      });
      if (config.accessabilityMode) document.querySelector('html').classList.add('accessability');
      else document.querySelector('html').classList.remove('accessability');
    }
  }
}
</script>

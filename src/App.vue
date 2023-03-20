<template>
  <div class="app" id="app" :class="{ rtl: isRtl, [appTheme]: true, accessability: isAccessabilityMode }">
    <div class="app-content">
      <AppAside/>
      <div class="right">
        <AppHeader @action="isLoading = true" @endAction="isLoading=false"/>
        <main class="app-main">
          <router-view class="main-content" v-if="settings && config"/>
        </main>
      </div>
    </div>
    <AppFooter/>
    <Loader v-if="isLoading" :msg="showSleepMsg? $t('serverSleepsMsg') : ''"/>
  </div>
</template>

<script>
import AppHeader from '@/modules/common/cmps/AppHeader.vue';
import AppFooter from '@/modules/common/cmps/AppFooter.vue';
import AppAside from '@/modules/common/cmps/AppAside.vue';
import { socketService } from '@/modules/common/services/socket.service';
import evEmmiter from '@/modules/common/services/event-emmiter.service';
import Loader from './modules/common/cmps/Loader.vue';
import { alertService } from './modules/common/services/alert.service';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    AppAside,
    Loader
  },
  data() {
    return {
      isLoading: false,
      showSleepMsg: false,
    }
  },
  computed: {
    settings() {
      return this.$store.getters['settings/settings'];
    },
    config() {
      return this.$store.getters['settings/config'];
    },
    uiConfig() {
      return this.$store.getters['settings/uiConfig'];
    },
    isDarkMode() {
      return this.uiConfig.darkMode
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
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  async created() {
    this.isLoading = true;
    const timeoutId = setTimeout(() => {
      if (this.isLoading) this.showSleepMsg = true;
    }, 7000);
    await socketService.connect();
    try {
      await Promise.all([
        this.$store.dispatch('settings/loadSettings'),
        this.$store.dispatch('settings/loadConfig'),
        this.$store.dispatch('auth/getUserInfo')
      ]);
    } catch(e) {}
    clearTimeout(timeoutId);
    this.showSleepMsg = false;
    this.isLoading = false;

    this.displayUiConfig()
    evEmmiter.on('app_config_update', this.displayUiConfig);

    if (['HomePage'].includes(this.$route.name) && this.loggedUser && localStorage.logged_organization_id) this.$router.push({ name: 'OrganizationDetails', params: {id: localStorage.logged_organization_id} })
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
      if (config.accessabilityMode) document.querySelector('html').classList.add('accessability');
      else document.querySelector('html').classList.remove('accessability');
    }
  }
}
</script>

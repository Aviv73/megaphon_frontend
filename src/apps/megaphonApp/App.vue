<template>
  <div class="app megaphon-app height-all">
    <div class="app-content">
      <!-- <AppAside/> -->
      <div class="right height-all flex column">
        <AppHeader/>
        <main class="app-main height-all flex-1 flex column">
          <router-view class="main-content width-all flex-1 align-start"/>
        </main>
      </div>
    </div>
    <!-- <AppFooter/> -->
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import './assets/style/index.scss';

import AppHeader from './modules/common/cmps/AppHeader.vue';
// import AppFooter from './modules/common/cmps/AppFooter.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';


export default {
  name: 'MegaphonApp',
  components: {
    AppHeader,
    // AppFooter,
    // AppAside
    Loader
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  async created() {
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
    if (!this.loggedUser) this.$router.push('/login');
    else {
      if (this.$route.params.organizationId) return;
      const firstOrg = this.loggedUser.organizations.filter(c => c.organizationId != '-1')[0];
      if (!firstOrg) return;
      this.$router.push({name: 'ReleasePage', params: {organizationId: firstOrg.organizationId}});
    }
  }
}
</script>

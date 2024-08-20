<template>
  <!-- <div class="release-details height-all" v-if="release">
    <GroupReleaseDetails v-if="isMonthlyRelease" :release="releaseData"/>
    <SimpleReleaseDetails v-else :release="releaseData"/>
  </div> -->
  
  <CommonReleaseDetails class="inner-container main-pad-y" :tabView="true"/>
</template>

<script>
import CommonReleaseDetails from '@/apps/common/modules/release/views/common_ReleaseDetails.vue';
// import GroupReleaseDetails from './default_GroupReleaseDetails.vue';
// import SimpleReleaseDetails from './default_SimpleReleaseDetails.vue';
// import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

export default {
  name: 'default_ReleaseDetails',
  components: {
    CommonReleaseDetails,
    // GroupReleaseDetails,
    // SimpleReleaseDetails
  },
  // methods: {
  //   getItem() {
  //     return this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id });
  //   },
  //   async init() {
  //     await this.getItem();
  //     const locale = this.release?.design?.locale || 'he';
  //     if (locale) this.$i18n.locale = locale;
  //   }
  // },
  // computed: {
  //   release() {
  //     return this.$store.getters['release/selectedItem'];
  //   },
  //   isMonthlyRelease() {
  //     // return this.release.releaseData.page === 'group';
  //     return !!this.release?.releaseData?.childrenReleases;
  //   },

  //   releaseData() {
  //     return {...this.release.releaseData, _id: this.release._id};
  //   }
  // },
  // created() {
  //   this.init();
  // },
  // destroyed() {
  //   evEmmiter.emit('set_locale'); // reset locale to uiConfig locale
  // },
  // watch: {
  //   '$route.params.id'() {
  //     this.init();
  //   }
  // }
}
</script>
    
<style lang="scss">
@import '@/assets/styles/global/index';
.defaultApp {
  .release-details {
  }
}
</style>
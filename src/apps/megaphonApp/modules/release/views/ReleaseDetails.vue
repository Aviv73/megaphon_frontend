<template>
  <CommonReleaseDetails/>
</template>

<script>
// import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import CommonReleaseDetails from '../../../../common/modules/release/views/common_ReleaseDetails.vue';

export default {
  components: { CommonReleaseDetails },
  name: 'ReleaseDetails',
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
  //     return !!this.release.releaseData.childrenReleases;
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
.megaphon-app {
  .release-details {
  }
}
</style>
<template>
  <div class="release-details height-all" v-if="release">
    <GroupReleaseDetails v-if="isMonthlyRelease" :release="releaseData"/>
    <SimpleReleaseDetails v-else :release="releaseData"/>
  </div>
</template>

<script>
import GroupReleaseDetails from './common_GroupReleaseDetails.vue';
import SimpleReleaseDetails from './common_SimpleReleaseDetails.vue';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

export default {
  name: 'common_ReleaseDetails',
  methods: {
    getItem() {
      return this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id, organizationId: this.$route.params.organizationId });
    },
    async init() {
      await this.getItem();
      const locale = this.release?.design?.locale || 'he';
      if (locale) this.$i18n.locale = locale;
    }
  },
  computed: {
    release() {
      return this.$store.getters['release/selectedItem'];
    },
    isMonthlyRelease() {
      // return this.release.releaseData.page === 'group';
      return !!this.release.releaseData.childrenReleases;
    },

    releaseData() {
      return {...this.release.releaseData, _id: this.release._id};
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    evEmmiter.emit('set_locale'); // reset locale to uiConfig locale
  },
  watch: {
    '$route.params.id'() {
      this.init();
    }
  },
  components: {
    GroupReleaseDetails,
    SimpleReleaseDetails
  }
}
</script>
    
<style lang="scss">
@import '@/assets/styles/global/index';
.default-app {
  .release-details {
  }
}
</style>
<template>
  <div class="release-details height-all" v-if="release">
    <SimpleReleaseDetails v-if="!isMonthlyRelease" :release="release"/>
    <GroupReleaseDetails v-else :release="release"/>
  </div>
</template>

<script>
import GroupReleaseDetails from './streamTv_GroupReleaseDetails.vue';
import SimpleReleaseDetails from './streamTv_SimpleReleaseDetails.vue';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

export default {
  name: 'streamTv_ReleaseDetails',
  methods: {
    getItem() {
      return this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id });
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
    },
    tabName() {
      // return 'summary';
      return this.$route.params.tabName;
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
.defaultApp {
  .release-details {
  }
}
</style>
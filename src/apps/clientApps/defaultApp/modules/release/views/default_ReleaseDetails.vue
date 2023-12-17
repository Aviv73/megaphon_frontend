<template>
  <div class="release-details height-all" v-if="release">
    <GroupReleaseDetails v-if="isMonthlyRelease" :release="releaseData"/>
    <SimpleReleaseDetails v-else :release="releaseData"/>
  </div>
</template>

<script>
import GroupReleaseDetails from './default_GroupReleaseDetails.vue';
import SimpleReleaseDetails from './default_SimpleReleaseDetails.vue';

export default {
  name: 'default_ReleaseDetails',
  methods: {
    getItem() {
      this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id });
    }
  },
  computed: {
    release() {
      return this.$store.getters['release/selectedItem'];
    },
    isMonthlyRelease() {
      // return this.release.releaseData.releaseType === 'group';
      return !!this.release.releaseData.childrenReleases;
    },

    releaseData() {
      return {...this.release.releaseData, _id: this.release._id};
    }
  },
  created() {
    this.getItem();
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
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
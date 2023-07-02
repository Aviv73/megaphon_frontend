<template>
  <div class="release-details height-all" v-if="release">
    <MonthlyReleaseDetails v-if="isMonthlyRelease" :release="releaseData"/>
    <BookReleaseDetails v-else :release="releaseData"/>
  </div>
</template>

<script>
import MonthlyReleaseDetails from './MonthlyReleaseDetails.vue';
import BookReleaseDetails from './BookReleaseDetails.vue';

export default {
  name: 'ReleaseDetails',
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
    MonthlyReleaseDetails,
    BookReleaseDetails
  }
}
</script>
    
<style lang="scss">
@import '@/assets/styles/global/index';
.release-details {
}
</style>
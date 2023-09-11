<template>
  <div class="release-report container" v-if="release && report">
    <div class="flex align-center space-between gap10 width-all">
      <h2>{{$t('distribute.report')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
    </div>
    <pre>{{report}}</pre>
  </div>
</template>

<script>

export default {
  name: 'ReleaseReport',
  methods: {
    getRelease() {
      this.$store.dispatch({ type: 'release/loadItem', id: this.releaseId });
    },
    getReport() {
      this.$store.dispatch({ type: 'release/loadReport', releaseId: this.releaseId });
    },
    init() {
      this.getRelease();
      this.getReport();
    }
  },
  computed: {
    releaseId() {
      return this.$route.params.id;
    },
    release() {
      return this.$store.getters['release/selectedItem'];
    },
    report() {
      return this.$store.getters['release/selectedReleaseReport'];
    },
  },
  created() {
    this.init();
  },
  watch: {
    '$route.params.id'() {
      this.init();
    }
  }
}
</script>
    
<style lang="scss">
@import '@/assets/styles/global/index';
.release-report {
}
</style>
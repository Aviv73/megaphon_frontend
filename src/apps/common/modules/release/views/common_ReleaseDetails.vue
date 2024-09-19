<template>
  <div class="release-details height-all flex align-start gap50" v-if="release">
    <ReleaseTabView class="width-all" :release="release" :tabView="true"/>
  </div>
</template>

<script>
import ReleaseTabView from '../cmps/ReleaseTabView.vue';
export default {
  name: 'common_ReleaseDetails',
  components: { ReleaseTabView }, 
  methods: {
    getItem() {
      return this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id, organizationId: this.$route.params.organizationId });
    }
  },
  computed: {
    release() {
      return this.$store.getters['release/selectedItem'];
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
}
</script>
  
<style lang="scss">
@import '@/assets/styles/global/index';
.release-details {
  .release-page-nav {
    height: fit-content;
    top: calc(#{em(10px)} + #{$header-height});
  }
}
</style>
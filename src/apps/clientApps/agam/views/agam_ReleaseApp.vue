<template>
  <div class="release-app inner-app">
    <!-- <nav class="flex align-center gap5">
      <router-link :to="{name: 'ReleasePage'}">{{$t('examples')}}</router-link>
    </nav> -->
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading" fullScreen/>
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'agam_ReleaseApp',
  computed: {
    isLoading() {
      return this.$store.getters['release/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
<template>
  <div class="release-app inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading" fullScreen/>
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'streamTv_ReleaseApp',
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
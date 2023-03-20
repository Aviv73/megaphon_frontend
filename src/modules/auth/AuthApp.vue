<template>
  <div class="auth-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'AuthApp',
  computed: {
    isLoading() {
      return this.$store.getters['auth/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
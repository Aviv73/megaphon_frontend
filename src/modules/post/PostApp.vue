<template>
  <div class="post-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'PostApp',
  computed: {
    isLoading() {
      return this.$store.getters['post/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
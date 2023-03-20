<template>
  <div class="bug-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>


<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'BugApp',
  computed: {
    isLoading() {
      return this.$store.getters['bug/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
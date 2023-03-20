<template>
  <div class="dashboard-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>


<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'DashboardApp',
  computed: {
    isLoading() {
      return this.$store.getters['dashboard/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
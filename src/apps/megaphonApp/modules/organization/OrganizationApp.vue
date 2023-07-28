<template>
  <div class="organization-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading && false"/>
  </div>
</template>


<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'OrganizationApp',
  computed: {
    isLoading() {
      return this.$store.getters['organization/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
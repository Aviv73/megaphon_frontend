<template>
  <div class="settings-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>


<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'SettingsApp',
  computed: {
    isLoading() {
      return this.$store.getters['settings/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
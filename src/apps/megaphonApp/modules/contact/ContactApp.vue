<template>
  <div class="contact-app container inner-app">
    <!-- <nav class="flex align-center gap5">
      <router-link :to="{name: 'ExamplePage'}">{{$t('examples')}}</router-link>
    </nav> -->
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading && false"/>
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'ContactApp',
  computed: {
    isLoading() {
      return this.$store.getters['contact/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
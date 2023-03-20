<template>
  <div class="example-app container inner-app">
    <!-- <nav class="flex align-center gap5">
      <router-link :to="{name: 'ExamplePage'}">{{$t('examples')}}</router-link>
    </nav> -->
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'ExampleApp',
  computed: {
    isLoading() {
      return this.$store.getters['example/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
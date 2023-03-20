<template>
  <div class="shoppingList-app container inner-app">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>


<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'ShoppingListApp',
  computed: {
    isLoading() {
      return this.$store.getters['shoppingList/isLoading'];
    }
  },
  components: {
    Loader
  }
}
</script>
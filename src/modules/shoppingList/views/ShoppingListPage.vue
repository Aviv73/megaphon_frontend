<template>
  <section class="shoppingList-page height-all width-all flex column gap10">
    <h2>{{$t('shoppingList.shoppingList')}}</h2>
    <ItemSearchList
      :itemsData="shoppingListsData"
      :initFilterBy="filterBy"
      @filter="getShoppingList"
      itemDetailesPageName="ShoppingListDetails"
      newItemPageName="ShoppingListEdit"
      :singlePreviewCmp="ShoppingListPreview"
      :isLoading="isLoading"
      :showLoader="false"
    />
    <Loader v-if="isLoading" />
  </section>
</template>

<script>
import ShoppingListPreview from '../cmps/ShoppingListPreview.vue';
import ItemSearchList from '@/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'ShoppingListPage',
  data() {
    return {
      ShoppingListPreview
    }
  },
  methods: {
    getShoppingList(filterBy) {
      this.$store.dispatch({ type: 'shoppingList/loadShoppingLists', filterBy, organizationId: this.$route.params.organizationId });
    }
  },
  computed: {
    shoppingListsData() {
      return this.$store.getters['shoppingList/shoppingListsData'];
    },
    filterBy() {
      return this.$store.getters['shoppingList/filterBy'];
    },
    isLoading() {
      return this.$store.getters['shoppingList/isLoading'];
    }
  },
  watch: {
    '$route.params.organizationId'() {
      this.getShoppingList();
    }
  },
  components: { ShoppingListPreview, ItemSearchList, Loader }
}
</script>
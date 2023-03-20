<template>
  <div class="shoppingList-details">
    <div>
      <router-link v-if="shoppingList" :to="{name: 'ShoppingListEdit', params: {id: shoppingList._id}}"><button>{{$t('edit')}}</button></router-link>
      <button @click="removeShoppingList">{{$t('delete')}}</button>
    </div>
    <pre v-if="shoppingList">{{shoppingList}}</pre>
  </div>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';
import { commentService } from '@/modules/comment/services/comment.service';
import FormInput from '@/modules/common/cmps/FormInput.vue';
import CommentList from '@/modules/comment/cmps/CommentList.vue';

export default {
  name: 'ShoppingListDetails',
  data() {
    return {
      commentToAdd: commentService.getEmptyItem()
    }
  },
  methods: {
    getItem() {
      this.$store.dispatch({ type: 'shoppingList/loadShoppingList', id: this.$route.params.id, organizationId: this.orgId });
    },
    async removeShoppingList() {
      await this.$store.dispatch({ type: 'shoppingList/removeShoppingList', id: this.shoppingList._id, organizationId: this.orgId });
      this.$router.push({name: 'ShoppingListPage'});
    }
  },
  computed: {
    orgId() {
      return this.$route.params.organizationId;
    },
    shoppingList() {
      return this.$store.getters['shoppingList/selectedShoppingList'];
    }
  },
  created() {
    this.getItem();
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    }
  },
  components: {
    Loader,
    FormInput,
    CommentList
  }
}
</script>
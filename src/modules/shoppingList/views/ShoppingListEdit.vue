<template>
  <div class="shoppingList-edit">
    <form v-if="shoppingListToEdit" @submit.prevent="saveShoppingList">
      <FormInput placeholder="shoppingListName" type="text" v-model="shoppingListToEdit.title"/>
      <button :disabled="!isItemValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue';
export default {
  name: 'shoppingListEdit',
  data() {
    return {
      shoppingListToEdit: null
    }
  },
  computed: {
    isItemValid() {
      return this.shoppingListToEdit && this.shoppingListToEdit.title;
    }
  },
  methods: {
    async getItem() {
      this.shoppingListToEdit = await this.$store.dispatch({ type: 'shoppingList/loadShoppingList', id: this.$route.params.id, organizationId: this.$route.params.organizationId });
    },
    async saveShoppingList() {
      if (!this.isItemValid) return;
      await this.$store.dispatch({ type: 'shoppingList/saveShoppingList', shoppingList: this.shoppingListToEdit, organizationId: this.$route.params.organizationId });
      this.$router.push('/shopping-list/' + this.$route.params.organizationId);
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
    FormInput
  }
}
</script>
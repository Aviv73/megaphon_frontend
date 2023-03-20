<template>
  <div class="example-edit">
    <form v-if="itemToEdit" @submit.prevent="saveItem">
      <FormInput type="text" v-model="itemToEdit.key"/>
      <button :disabled="!isItemValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue'
export default {
  name: 'ExampleEdit',
  data() {
    return {
      itemToEdit: null
    }
  },
  computed: {
    isItemValid() {
      return this.itemToEdit && this.itemToEdit.key;
    }
  },
  methods: {
    async getItem() {
      this.itemToEdit = await this.$store.dispatch({ type: 'example/loadItem', id: this.$route.params.id });
    },
    async saveItem() {
      if (!this.isItemValid) return;
      await this.$store.dispatch({ type: 'example/saveItem', item: this.itemToEdit });
      this.$router.push('/example');
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
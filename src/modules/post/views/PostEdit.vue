<template>
  <div v-if="postToEdit" class="post-edit flex column gap20">
    <h2>{{$t( postToEdit._id? 'post.editPost' : 'post.createNewPost')}}</h2>
    <form @submit.prevent="savePost" class="simple-form">
      <FormInput type="textarea" placeholder="post.saySomething" v-model="postToEdit.content"/>
      <button class="btn big primary" :disabled="!isItemValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue'
export default {
  name: 'PostEdit',
  data() {
    return {
      postToEdit: null
    }
  },
  computed: {
    isItemValid() {
      return this.postToEdit && this.postToEdit.content;
    }
  },
  methods: {
    async getItem() {
      this.postToEdit = await this.$store.dispatch({ type: 'post/loadPost', id: this.$route.params.id, organizationId: this.$route.params.organizationId });
    },
    async savePost() {
      if (!this.isItemValid) return;
      await this.$store.dispatch({ type: 'post/savePost', post: this.postToEdit, organizationId: this.$route.params.organizationId });
      this.$router.push('/post/' + this.$route.params.organizationId);
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
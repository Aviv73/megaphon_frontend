<template>
  <section class="post-page height-all width-all flex column gap10">
    <h2>{{$t('post.posts')}}</h2>
    <ItemSearchList
      :itemsData="postsData"
      :initFilterBy="filterBy"
      @filter="getPosts"
      itemDetailesPageName="PostDetails"
      newItemPageName="PostEdit"
      :singlePreviewCmp="PostPreview"
      :isLoading="isLoading"
      :showLoader="false"
      @remove="removePost"
    />
    <Loader v-if="isLoading" />
  </section>
</template>

<script>
import PostPreview from '../cmps/PostPreview.vue';
import ItemSearchList from '@/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'PostPage',
  data() {
    return {
      PostPreview
    }
  },
  methods: {
    getPosts(filterBy) {
      this.$store.dispatch({ type: 'post/loadPosts', filterBy, organizationId: this.orgId });
    },
    removePost(id) {
      this.$store.dispatch({type: 'post/removePost', id, organizationId: this.orgId });
    },
  },
  computed: {
    orgId() {
      return this.$route.params.organizationId;
    },
    postsData() {
      return this.$store.getters['post/data'];
    },
    filterBy() {
      return this.$store.getters['post/filterBy'];
    },
    isLoading() {
      return this.$store.getters['post/isLoading'];
    }
  },
  watch: {
    'orgId'() {
      this.getPosts();
    }
  },
  components: { PostPreview, ItemSearchList, Loader }
}
</script>
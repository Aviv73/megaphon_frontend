<template>
  <li class="post-preview item-preview flex column gap10">
    <!-- <router-link :to="'/post/' + $route.params.organizationId + '/' + item._id">
      <pre>{{item}}</pre>
    </router-link> -->
    <div v-if="isCreator" class="flex gap10">
      <router-link v-if="post" :to="{name: 'PostEdit', params: { id: post._id } }"><button class="btn secondary">{{$t('edit')}}</button></router-link>
      <button class="btn danger" @click="removePost">{{$t('delete')}}</button>
    </div>
    <div v-if="post" class="flex column gap10 flex-1 space-between">
      <div>
        <p>{{post.createdBy.username}}</p>
        <p>{{post.content}}</p>
      </div>
      <button class="btn" @click="showComments = !showComments">{{$t(showComments? 'comment.hideComments' : 'comment.showComments')}}</button>
      <CommentList v-show="showComments" :attachedId="post._id"/>
    </div>
  </li>
</template>

<script>
import CommentList from '@/modules/comment/cmps/CommentList.vue';
export default {
  name: 'PostPreview',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showComments: false
    }
  },
  computed: {
    orgId() {
      return this.$route.params.organizationId;
    },
    post() {
      return this.item;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    isCreator() {
      return this.loggedUser._id === this.post.createdBy._id;
    }
  },
  methods: {
    async removePost() {
      this.$emit('remove', this.post._id);
      // this.$router.push({name: 'PostPage'});
    },
  },
  components: { CommentList }
}
</script>
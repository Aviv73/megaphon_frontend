<template>
  <div class="post-details">
    <div>
      <router-link v-if="post" :to="{name: 'PostEdit', params: {id: post._id}}"><button class="btn secondary">{{$t('edit')}}</button></router-link>
      <button class="btn danger" @click="removePost">{{$t('delete')}}</button>
    </div>
    <div v-if="post">
      <div>
        <p>{{post.createdBy.username}}</p>
        <pre>{{post.content}}</pre>
      </div>
      <div>
        <!-- <FormInput placeholder="comment" v-model="commentToAdd.content" @keypress.native.enter="addComment"/> -->
        <CommentList :attachedId="post._id"/>
        <!-- <ul class="comment-list flex column gap5">
          <li v-for="comment in post.comments.items" :key="comment._id">
            {{comment.createdBy.username}}: {{comment.content}} <button @click="removeComment(comment._id)">X</button>
          </li>
        </ul> -->
      </div>
    </div>
    <!-- <pre v-if="post">{{post}}</pre> -->
  </div>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';
import { commentService } from '@/modules/comment/services/comment.service';
import FormInput from '@/modules/common/cmps/FormInput.vue';
import CommentList from '@/modules/comment/cmps/CommentList.vue';

export default {
  name: 'PostDetails',
  data() {
    return {
      commentToAdd: commentService.getEmptyItem()
    }
  },
  methods: {
    getItem() {
      this.$store.dispatch({ type: 'post/loadPost', id: this.$route.params.id, organizationId: this.orgId });
    },
    async removePost() {
      await this.$store.dispatch({ type: 'post/removePost', id: this.post._id, organizationId: this.orgId });
      this.$router.push({name: 'PostPage'});
    },

    async addComment() {
      const addedComment = await this.$store.dispatch({ type: 'comment/addComment', comment: this.commentToAdd, attachedId: this.post._id });
      this.$store.commit({ type: 'post/addComment', comment: addedComment });
      this.commentToAdd = commentService.getEmptyItem();
    },
    async removeComment(commentId) {
      await this.$store.dispatch({ type: 'comment/removeComment', commentId });
      this.$store.commit({ type: 'post/removeComment', commentId });
      this.commentToAdd = commentService.getEmptyItem();
    }
  },
  computed: {
    orgId() {
      return this.$route.params.organizationId;
    },
    post() {
      return this.$store.getters['post/selectedPost'];
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
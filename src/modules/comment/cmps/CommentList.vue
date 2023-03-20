<template>
  <section class="comment-list-container flex column gap10">
    <SearchInput placeholder="comment.comment" btn="send" v-model="commentToAdd.content" @change="addComment" />
    <ul class="comment-list flex column gap5">
      <li v-for="comment in comments" :key="comment._id" class="width-all flex column gap5 comment-preview">
        <div class="flex space-between width-all">
          <MiniAccountPreview :account="comment.createdBy"/>
          <button class="btn small" v-if="isCommentCreator(comment)" @click="removeComment(comment._id)">X</button>
        </div>
        <p> {{comment.content}}</p>
      </li>

      <li v-if="isLoading">
        <Loader/>
      </li>
      <li v-else-if="isLoadable">
        <button class="btn" @click="loadChunk">{{$t('loadMore')}}</button>
      </li>
      <li v-else>
        {{$t('comment.noMoreComments')}}
      </li>
    </ul>
  </section>
</template>

<script>
// import ItemChunkLoaderList from '@/modules/common/cmps/ItemChunkLoaderList.vue';
import Loader from '@/modules/common/cmps/Loader.vue';
import { commentService } from '@/modules/comment/services/comment.service';
import FormInput from '@/modules/common/cmps/FormInput.vue';
import { socketService } from '@/modules/common/services/socket.service';
import SearchInput from '../../common/cmps/SearchInput.vue';
import MiniAccountPreview from '../../account/cmps/MiniAccountPreview.vue';

export default {
  name: 'CommentList',
  props: {
    attachedId: {
      type: String
    }
  },
  data() {
    return {
      isLoading: false,
      commentsData: null,
      page: 0,
      
      commentToAdd: commentService.getEmptyItem(),
      offSocketMethod: []
    }
  },
  created() {
    this.loadChunk();
    socketService.on('add-comment-for-item-' + this.attachedId, this.onSocketAddComment);
    socketService.on('remove-comment-for-item-' + this.attachedId, this.onSocketRemoveComment);
  },
  destroyed() {
    socketService.off('add-comment-for-item-' + this.attachedId, this.onSocketAddComment);
    socketService.off('remove-comment-for-item-' + this.attachedId, this.onSocketRemoveComment);
  },
  computed: {
    comments() {
      return this.commentsData?.items || [];
    },
    isLoadable() {
      return this.commentsData?.items?.length < this.commentsData?.total;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  methods: {
    loadComments(pagination) {
      return this.$store.dispatch({ type: 'comment/simpleLoadComments', filterBy: {  filter: { params: { attachedId: this.attachedId } }, pagination } });
    },
    async loadChunk() {
      this.isLoading = true;
      const pageData = { page: this.page, limit: 10 };
      const data = await this.loadComments(pageData);
      if (!this.commentsData) this.commentsData = data;
      else this.commentsData.items.push(...data.items);
      this.page++;
      this.isLoading = false;
    },

    async addComment() {
      const addedComment = await this.$store.dispatch({ type: 'comment/addComment', comment: this.commentToAdd, attachedId: this.attachedId });

      // this.commentsData.items.push(addedComment);
      // this.commentsData.total++;

      this.commentToAdd = commentService.getEmptyItem();
    },
    async removeComment(commentId) {
      const res = await this.$store.dispatch({ type: 'comment/removeComment', id: commentId });
      if (!res) return;
      this.$store.commit({ type: 'post/removeComment', commentId });
      this.commentToAdd = commentService.getEmptyItem();

      this.localRemoveComment(commentId);
    },

    localRemoveComment(id) {
      const idx = this.commentsData.items.findIndex(c => c._id === id);
      if (idx === -1) return;
      this.commentsData.items.splice(idx, 1);
      this.commentsData.total--;
    },


    onSocketAddComment({comment}) {
      const idx = this.commentsData.items.findIndex(c => c._id === comment._id);
      if (idx === -1) {
        this.commentsData.items.unshift(comment);
        this.commentsData.total++;
      }
      else this.commentsData.items.splice(idx, 1, comment);
    },
    onSocketRemoveComment({id}) {
      this.localRemoveComment(id);
    },

    
    isCommentCreator(comment) {
      return this.loggedUser._id === comment.createdBy._id;
    }
  },
  components: { Loader, FormInput, SearchInput, MiniAccountPreview }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.comment-list {
  .comment-preview {
    padding: 5px;
    border-radius: 5px;
    box-shadow: $light-shadow;
  }
}
</style>
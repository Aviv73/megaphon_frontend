import { postService } from './services/post.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

import { $t } from '@/plugins/i18n';

const initState = () => ({
  ...basicStoreService.initState()
});

const basicStore = basicStoreService.createSimpleCrudStore(initState);

export const _postStore = {
  namespaced: true,
  state: basicStore.state,
  getters: {
    ...basicStore.getters
  },
  mutations: {
    ...basicStore.mutations,
    addComment(state, { comment }) {
      state.selectedItem.comments.items.unshift(comment);
      state.selectedItem.comments.total++;
    },
    removeComment(state, { commentId }) {
      const idx = state.selectedItem?.comments.items.findIndex(c => c._id === commentId) || -1;
      if (idx === -1) return;
      state.selectedItem.comments.items.splice(idx, 1);
      state.selectedItem.comments.total--;
    }
  },

  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadPosts({ commit, dispatch }, { filterBy, organizationId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const postsRes = await postService.query(filterBy, organizationId);
          return postsRes;
        },
        onSuccess: (data) => commit({ type: 'setData', data })
      });
    },
    async loadPost({ commit, dispatch }, { id, organizationId }) {
      commit({ type: 'setSelectedItem', item: null });
      return dispatch({
        type: '_Ajax',
        do: async () => postService.get(id, organizationId),
        onSuccess: (post) => commit({ type: 'setSelectedItem', item: post })
      });
    },
    async removePost({ commit, dispatch }, { id, organizationId }) {
      if (!await alertService.Confirm($t('post.alerts.confirmRemove'))) return;
      return dispatch({
        type: '_Ajax',
        do: async () => postService.remove(id, organizationId),
        onSuccess: () => alertService.toast({type: 'safe', msg: `${$t('post.alerts.removeSuccess')}! id: ${id}`})
      });
    },
    async savePost({ commit, dispatch }, { post, organizationId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => postService.save(post, organizationId),
        onSuccess: (data) => alertService.toast({type: 'safe', msg: `${$t('post.alerts.savedSuccess')}! id: ${data._id}`})
      });
    },
  }
}

export const postStore = { post: _postStore };
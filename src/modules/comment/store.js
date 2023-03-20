import { commentService } from './services/comment.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

import { $t } from '@/plugins/i18n';

const initState = () => ({
  ...basicStoreService.initState()
});

const basicStore = basicStoreService.createSimpleCrudStore(initState);

export const _commentStore = {
  namespaced: true,
  state: basicStore.state,
  getters: {
    ...basicStore.getters
  },
  mutations: {
    ...basicStore.mutations
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadComments({ commit, dispatch }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const commentsRes = await commentService.query(filterBy);
          return commentsRes;
        },
        // onSuccess: (data) => commit({ type: 'setComments', data })
        onSuccess: (data) => {}
      });
    },
    async loadComment({ commit, dispatch }, { id }) {
      commit({ type: 'setSelectedItem', comment: null });
      return dispatch({
        type: '_Ajax',
        do: async () => commentService.get(id),
        onSuccess: (comment) => commit({ type: 'setSelectedItem', item: comment })
      });
    },
    async removeComment({ commit, dispatch }, { id }) {
      if (!await alertService.Confirm($t('comment.alerts.confirmRemove'))) return;
      return dispatch({
        type: '_Ajax',
        do: async () => commentService.remove(id),
        onSuccess: () => alertService.toast({type: 'safe', msg: `${$t('comment.alerts.removedSuccess')}! id: ${id}`})
      });
    },
    async addComment({ commit, dispatch }, { comment, attachedId }) {
      comment.attachedId = attachedId;
      return dispatch({
        type: '_Ajax',
        do: async () => commentService.add(comment),
        onSuccess: ((addedComment) => {
          // commit({ type: 'addComment', comment: addedComment });
        })
      });
    },
    async saveComment({ commit, dispatch }, { comment }) {
      return dispatch({
        type: '_Ajax',
        do: async () => commentService.save(comment),
        onSuccess: (data) => alertService.toast({type: 'safe', msg: `${$t('comment.alerts.savedSuccess')}! id: ${data._id}`})
      });
    },

    async simpleLoadComments(context, { filterBy }) {
      return await commentService.query(filterBy);
    }
  }
}

export const commentStore = { comment: _commentStore };
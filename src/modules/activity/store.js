import { activityService } from './services/activity.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

const initState = () => ({
  ...basicStoreService.initState()
});

const basicStore = basicStoreService.createSimpleCrudStore(initState);

export const _activityStore = {
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
    async loadActivity({ commit, dispatch }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const commentsRes = await activityService.query(filterBy);
          return commentsRes;
        },
        // onSuccess: (data) => commit({ type: 'setActivities', data })
        onSuccess: (data) => {}
      });
    },
    async loadActivity({ commit, dispatch }, { id }) {
      commit({ type: 'setSelectedItem', item: null });
      return dispatch({
        type: '_Ajax',
        do: async () => activityService.get(id),
        onSuccess: (item) => commit({ type: 'setSelectedItem', item })
      });
    },
    async addActivity({ commit, dispatch }, { activity, attachedId }) {
      activity = {
        ...activityService.getEmptyActivity(),
        ...activity,
        attachedId: attachedId
      }
      return dispatch({
        type: '_Ajax',
        do: async () => activityService.add(activity),
        onSuccess: ((addedActicvity) => {
          // commit({ type: 'addActivity', activity: addedActicvity });
        })
      });
    },
  }
}

export const activityStore = { activity: _activityStore };
import { releaseService } from './services/release.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';


const initState = () => ({
  ...basicStoreService.initState(),
  filterBy: {
    ...basicStoreService.initFilterBy(['type', 'subType'], []),
  },
  initReleaseId: null,
  organizationId: null
});

const baseStore = basicStoreService.createSimpleCrudStore(initState);

export const _releaseStore = {
  namespaced: true,
  state: baseStore.state,
  getters: {
    ...baseStore.getters,
    initReleaseId(state) { return sessionStorage.initReleaseId || state.initReleaseId },
    organizationId(state) { return '643eac15afc5d349300c087f' || sessionStorage.organizationId || state.organizationId }
  },
  mutations: {
    ...baseStore.mutations,
    setInitReleaseId(state, { id, orgId }) {
      if (state.initReleaseId) return;
      if (sessionStorage.initReleaseId) state.initReleaseId = sessionStorage.initReleaseId;
      else {
        state.initReleaseId = sessionStorage.initReleaseId = id;
        state.organizationId = sessionStorage.organizationId = orgId;
      }
    }
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadItems({ commit, dispatch, getters }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const filterToSend = JSON.parse(JSON.stringify(filterBy));
          if (!filterToSend.filter.params.type) delete filterToSend.filter.params.type;
          if (!filterToSend.filter.params.subType) delete filterToSend.filter.params.subType;
          const itemsRes = await releaseService.query(filterToSend, getters.organizationId);
          return itemsRes;
        },
        onSuccess: (data) => commit({ type: 'setData', data })
      });
    },
    async loadItem({ commit, dispatch, getters }, { id }) {
      return dispatch({
        type: '_Ajax',
        do: async () => releaseService.get(id, getters.organizationId),
        onSuccess: (item) => {
          commit({ type: 'setSelectedItem', item })
          commit({ type: 'setInitReleaseId', id, orgId: item.organizationId });
        }
      });
    },
  }
}

export const releaseStore = { release: _releaseStore };
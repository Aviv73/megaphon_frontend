import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

// import appConfig from '@/config.js';
import selectedAppData from '@/apps/index.js';

const initState = () => ({
  ...basicStoreService.initState(),
  filterBy: {
    ...basicStoreService.initFilterBy(['type', 'subType'], []),
  },
  initReleaseId: null,
  organizationId: null,
});

export const releaseStore = basicStoreService.createSimpleCrudStore(
  'release',
  initState,
  {
    getters: {
      initReleaseId(state) { return state.initReleaseId },
      // organizationId(state) { return  selectedAppData.params.organizationId || selectedAppData.params.appName || sessionStorage.organizationId || state.organizationId }
      organizationId(state) { return  selectedAppData.params.organizationId || selectedAppData.params.appName }
    },
    mutations: {
      setInitReleaseId(state, { id, orgId }) {
        if (state.initReleaseId) return;
        // if (sessionStorage.initReleaseId) state.initReleaseId = sessionStorage.initReleaseId;
        else {
          state.initReleaseId = sessionStorage.initReleaseId = id;
          state.organizationId = sessionStorage.organizationId = orgId;
        }
      }
    },
    actions: {
      async loadItems({ commit, dispatch, getters }, { filterBy, organizationId, orgFilter }) {
        return dispatch({
          type: '_Ajax',
          do: async () => {
            if (filterBy) commit({ type: 'setFilterBy', filterBy });
            // const filterToSend = JSON.parse(JSON.stringify(filterBy));
            const filterToSend = {...getters.filterBy};
            if (!filterToSend.filter.params.type) delete filterToSend.filter.params.type;
            if (!filterToSend.filter.params.subType) delete filterToSend.filter.params.subType;
            filterToSend.orgFilter = orgFilter;
            // filterToSend.folder = folder;
            const itemsRes = await getters.service.query(filterToSend, organizationId || getters.organizationId);
            return itemsRes;
          },
          onSuccess: (data) => commit({ type: 'setData', data })
        });
      },
      async loadItem({ commit, dispatch, getters }, { id }) {
        return dispatch({
          type: '_Ajax',
          do: async () => getters.service.get(id, getters.organizationId),
          onSuccess: (item) => {
            commit({ type: 'setSelectedItem', item })
            commit({ type: 'setInitReleaseId', id, orgId: item.organizationId });
          }
        });
      },
    }
  }
);
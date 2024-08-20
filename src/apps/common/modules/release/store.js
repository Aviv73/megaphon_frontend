import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

// import appConfig from '@/config.js';
// import selectedAppData from '@/apps/index.js';

const initState = () => ({
  ...basicStoreService.initState(),
  filterBy: {
    ...basicStoreService.initFilterBy(['type', 'subType'], []),
  },
  // initReleaseId: null,
  organizationId: null,
  lastSeenGroupRelease: null,
  archiveReleases: [],
});

export const releaseStore = basicStoreService.createSimpleCrudStore(
  'release',
  initState,
  {
    getters: {
      // initReleaseId(state) { return state.initReleaseId },
      // organizationId(state) { return  selectedAppData.params.organizationId || selectedAppData.params.appName || sessionStorage.organizationId || state.organizationId }
      organizationId(state, getters, rootState, rootGetters) { 
        const selectedAppData = rootGetters.selectedAppData;
        return  selectedAppData.params.subDomain || selectedAppData.params.organizationId
      },
      lastSeenGroupRelease: (state) => state.lastSeenGroupRelease,
      archiveReleases: (state) => state.archiveReleases,
    },
    mutations: {
      setLastSeenGroupRelease(state, {release}) {
        state.lastSeenGroupRelease = release;
      },
      setArchiveReleases(state, {releases}) {
        state.archiveReleases = releases;
      },
      // setInitReleaseId(state, { id, orgId }) {
      //   if (state.initReleaseId) return;
      //   // if (sessionStorage.initReleaseId) state.initReleaseId = sessionStorage.initReleaseId;
      //   else {
      //     state.initReleaseId = sessionStorage.initReleaseId = id;
      //     state.organizationId = sessionStorage.organizationId = orgId;
      //   }
      // }
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
            // const itemsRes = await getters.service.query(filterToSend, this.getters['organization.selectedItem']?._id);
            return itemsRes;
          },
          onSuccess: (data) => {
            commit({ type: 'setData', data });
            return data;
          }
        });
      },
      async loadItem({ commit, dispatch, getters, state }, { id, dontSet }) {
        return dispatch({
          type: '_Ajax',
          do: async () => getters.service.get(id, getters.organizationId),
          onSuccess: (item) => {
            // if (!state.lastSeenGroupRelease) commit({ type: 'setAppInitedRelease', release: item });
            if (item?.releaseData?.childrenReleases?.length) commit({ type: 'setLastSeenGroupRelease', release: item });
            commit({ type: 'setSelectedItem', item });
            return item;
            // commit({ type: 'setInitReleaseId', id, orgId: item.organizationId });
          }
        });
      },
    }
  }
);
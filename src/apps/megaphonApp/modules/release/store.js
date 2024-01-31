import { releaseService } from './services/release.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

import { distributionService } from './services/distribution.service';

const initState = () => ({
  ...basicStoreService.initState(),
  selectedReleaseReport: null
});

export const releaseStore = basicStoreService.createSimpleCrudStore(
  'release',
  initState,
  {
    getters: {
      selectedReleaseReport(state) { return state.selectedReleaseReport }
    },
    mutations: {
      setSelectedReleaseReport(state, { report }) {
        state.selectedReleaseReport = report;
      }
    },
    actions: {
      async loadItems({ commit, dispatch, getters }, { filterBy, organizationId, orgFilter, folder }) {
        return dispatch({
          type: '_Ajax',
          do: async () => {
            if (filterBy) commit({ type: 'setFilterBy', filterBy });
            // const filterToSend = JSON.parse(JSON.stringify(filterBy));
            const filterToSend = {...getters.filterBy};
            filterToSend.orgFilter = orgFilter;
            filterToSend.folder = folder;
            const itemsRes = await releaseService.query(filterToSend, organizationId || getters.organizationId);
            return itemsRes;
          },
          onSuccess: (data) => commit({ type: 'setData', data })
        });
      },
      async loadReport({ commit, dispatch, getters }, { releaseId }) {
        return dispatch({
          type: '_Ajax',
          do: async () => distributionService.getByReleaseId(releaseId),
          onSuccess: (report) => {
            commit({ type: 'setSelectedReleaseReport', report });
          }
        });
      },
    }
  },
  releaseService
);
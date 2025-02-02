import { releaseService } from './services/release.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

import { distributionService } from './services/distribution.service';

const initState = () => ({
  ...basicStoreService.initState(),
  selectedReleaseReport: null,
  selectedContactReport: null,
});

export const releaseStore = basicStoreService.createSimpleCrudStore(
  'release',
  initState,
  {
    getters: {
      selectedReleaseReport(state) { return state.selectedReleaseReport },
      selectedContactReport(state) { return state.selectedContactReport }
    },
    mutations: {
      setSelectedReleaseReport(state, { report }) {
        state.selectedReleaseReport = report;
      },
      setSelectedContactReport(state, { report }) {
        state.selectedContactReport = report;
      }
    },
    actions: {
      async loadItems({ commit, dispatch, getters }, { filterBy, includeExpiredReleases, organizationId, orgFilter, folder, dontSet }) {
        if (!dontSet) commit({ type: 'setData', data: {items:[], total: 0} });
        return dispatch({
          type: '_Ajax',
          do: async () => {
            if (filterBy) commit({ type: 'setFilterBy', filterBy });
            // const filterToSend = JSON.parse(JSON.stringify(filterBy));
            const filterToSend = {...getters.filterBy, includeExpiredReleases};
            filterToSend.orgFilter = orgFilter;
            filterToSend.folder = folder;
            const itemsRes = await getters.service.query(filterToSend, organizationId || getters.organizationId);
            return itemsRes;
          },
          onSuccess: (data) => {
            commit({ type: 'setData', data })
            return data;
          }
        });
      },
      async loadReport({ commit, dispatch, getters }, { releaseId, organizationId }) {
        return dispatch({
          type: '_Ajax',
          do: async () => distributionService.getByReleaseId(organizationId, releaseId),
          onSuccess: (report) => {
            commit({ type: 'setSelectedReleaseReport', report });
            return report;
          }
        });
      },
      async removeDistData({ commit, dispatch, getters }, { releaseId, organizationId }) {
        return dispatch({
          type: '_Ajax',
          do: async () => distributionService.removeDistData(organizationId, releaseId),
          onSuccess: (report) => {
          }
        });
      },
      async loadContactReport({ commit, dispatch, getters }, { id, email }) {
        return dispatch({
          type: '_Ajax',
          do: async () => distributionService.getContactReport(id, email),
          onSuccess: (report) => {
            commit({ type: 'setSelectedContactReport', report });
            return report;
          }
        });
      },
    }
  },
  undefined,
  releaseService.getEmptyRelease
);
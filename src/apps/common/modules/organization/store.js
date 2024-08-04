import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

import appConfig from '@/appConfig.js';
// import selectedAppData from '@/apps/index.js';
import { organizationService } from './organization.service.js';

const initState = () => ({
  ...basicStoreService.initState(),
  organizationId: '',
  // rootAppOrg: null
});

export const organizationStore = basicStoreService.createSimpleCrudStore(
  'organization',
  initState,
  {
    // getters: {
    //   rootAppOrg(state) { return state.rootAppOrg; }
    // },
    // mutations: {
    //   setRootAppOrg(state, { org }) {
    //     state.rootAppOrg = org;
    //   }
    // },
    actions: {
      loadItem({ commit, dispatch, getters, rootGetters }, { organizationId, isRootAppOrg }) {
        const selectedAppData = rootGetters.selectedAppData;
        return dispatch({
          type: '_Ajax',
          do: async () => getters.service.get(organizationId || selectedAppData?.params?.organizationId || appConfig.subDomain, undefined, {isToInheritData: true}),
          onSuccess: (item) => {
            commit({ type: 'setSelectedItem', item });
            // if (isRootAppOrg) commit({ type: 'setRootAppOrg', org: item });
            commit({ type: 'setProp', key: 'organizationId', val: item._id });
          }
        });
      },
      async loadReleaseDataFields({ commit, dispatch, getters }, { organizationId, dataFieldsLocalFilePath, releaseType }) {
        return dispatch({
          type: '_Ajax',
          do: async () => {
            return await organizationService.loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType);
          },
        });
      },
    }
  }
);
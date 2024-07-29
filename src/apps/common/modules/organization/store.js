import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

import appConfig from '@/appConfig.js';
// import selectedAppData from '@/apps/index.js';
import { organizationService } from './organization.service.js';

const initState = () => ({
  ...basicStoreService.initState(),
  organizationId: '',
});

export const organizationStore = basicStoreService.createSimpleCrudStore(
  'organization',
  initState,
  {
    actions: {
      loadItem({ commit, dispatch, getters, rootGetters }, { organizationId }) {
        const selectedAppData = rootGetters.selectedAppData;
        return dispatch({
          type: '_Ajax',
          do: async () => getters.service.get(organizationId || selectedAppData?.params?.organizationId || appConfig.subDomain, undefined, {isToInheritData: true}),
          onSuccess: (item) => {
            commit({ type: 'setSelectedItem', item })
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
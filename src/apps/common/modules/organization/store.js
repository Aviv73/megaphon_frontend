import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

// import appConfig from '@/config.js';
import selectedAppData from '@/apps/index.js';

const initState = () => ({
  ...basicStoreService.initState(),
  organizationId: '',
});

export const organizationStore = basicStoreService.createSimpleCrudStore(
  'organization',
  initState,
  {
    actions: {
      loadItem({ commit, dispatch, getters }, { organizationId }) {
        return dispatch({
          type: '_Ajax',
          do: async () => getters.service.get(organizationId || selectedAppData.params.organizationId),
          onSuccess: (item) => {
            commit({ type: 'setSelectedItem', item })
            commit({ type: 'setProp', key: 'organizationId', val: item.organizationId })
          }
        });
      }
    }
  }
);
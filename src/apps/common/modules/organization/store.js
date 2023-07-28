import { organizationService } from './services/organization.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

// import appConfig from '@/config.js';
import selectedAppData from '@/apps/index.js';

const initState = () => ({
  ...basicStoreService.initState(),
  organizationId: selectedAppData.params.organizationId,
});

export const basicStore = basicStoreService.createSimpleCrudStore(initState, organizationService, 'organization');

const _organizationStore = {
  ...basicStore,
  actions: {
    ...basicStore.actions,
    loadItem({ commit, dispatch, getters }, { organizationId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.get(organizationId || selectedAppData.params.organizationId),
        onSuccess: (item) => commit({ type: 'setSelectedItem', item })
      });
    },
    getAllItems() {
      return organizationService.query(basicStoreService.initFilterBy());
    },
    async loadDataFields({ commit, dispatch, getters }, { organizationId, dataFieldsLocalFilePath }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          return await organizationService.loadDataFields(dataFieldsLocalFilePath, organizationId);
        },
      });
    }
  }
}

export const organizationStore = { organization: _organizationStore };
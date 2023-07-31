import { organizationService } from './services/organization.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

const initState = () => ({
  ...basicStoreService.initState(),
  selectedFolder: null,
  selectedFolderPath: null
});

export const basicStore = basicStoreService.createSimpleCrudStore(initState, organizationService, 'organization');

const _organizationStore = {
  ...basicStore,
  getters: {
    ...basicStore.getters,
    selectedFolder(state) { return state.selectedFolder },
    selectedFolderPath(state) { return state.selectedFolderPath }
  },
  mutations: {
    ...basicStore.mutations,
    setSelectedFolder(state, { folderPath, folder }) {
      state.selectedFolderPath = folderPath;
      state.selectedFolder = folder;
    }
  },
  actions: {
    ...basicStore.actions,
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
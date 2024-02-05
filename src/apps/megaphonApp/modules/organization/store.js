import { organizationService } from './services/organization.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

const initState = () => ({
  ...basicStoreService.initState(),
  selectedFolder: null,
  selectedFolderPath: null
});

export const organizationStore = basicStoreService.createSimpleCrudStore(
  'organization',
  initState,
  {
    getters: {
      selectedFolder(state) { return state.selectedFolder },
      selectedFolderPath(state) { return state.selectedFolderPath }
    },
    mutations: {
      setSelectedFolder(state, { folderPath, folder }) {
        state.selectedFolderPath = folderPath;
        state.selectedFolder = folder;
      }
    },
    actions: {
      getAllItems({ getters }) {
        return getters.service.query(basicStoreService.initFilterBy());
      },
      async loadReleaseDataFields({ commit, dispatch, getters }, { organizationId, dataFieldsLocalFilePath, releaseType }) {
        return dispatch({
          type: '_Ajax',
          do: async () => {
            return await organizationService.loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType);
          },
        });
      }
    }
  },
  undefined,
  organizationService.getEmptyOrganization
);
import { organizationService } from './services/organization.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service'

// import { setStylingForOrgTheme, setDynamicStylingThemeEl } from '@/apps/common/modules/common/services/dynamicPages.service.js';
import allThemes from '../../themes/index';

import { $t } from '@/plugins/i18n';
import { getRelevantThemeForOrg } from '../../../common/modules/common/services/dynamicPages.service';

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
      },
      loadAllDomainNames({ getters }) {
        return organizationService.loadAllDomainNames();
      },
      async inviteAccount({ commit, dispatch }, { organizationId, accountId, status, successMsg }) {
        return dispatch({
          type: '_Ajax',
          do: async () => organizationService.inviteAccount(organizationId, accountId, status),
          onSuccess: () => alertService.toast({type: 'safe', msg: `${$t(successMsg || 'organization.alerts.invetationSentSuccess')}!`})
        });
      },
      async updateAccountStatus({ commit, dispatch, getters }, { organizationId, accountId, newStatus }) {
        return dispatch({
          type: '_Ajax',
          do: async () => organizationService.updateAccountStatus(organizationId, accountId, newStatus),
          onSuccess: (data) => {
            // commit({ type: 'updateOrgStatus', organizationId, newStatus });
            commit('auth/updateOrgStatus', { organizationId, newStatus }, { root: true });
            return data;
          }
        });
      },
      loadItem({ commit, dispatch, getters }, { id, isToInheritData = true, dontSet = false, isToAddMembersData = false }) {
        return dispatch({
          type: '_Ajax',
          do: async () => getters.service.get(id, undefined, {isToInheritData, isToAddMembersData}),
          onSuccess: (item) => {
            if (!dontSet) {
              commit({ type: 'setSelectedItem', item });
              commit({ type: 'setProp', key: 'organizationId', val: item._id });
              if (item._id) {
                // setStylingForOrgTheme(item, '.megaphon-app');
                commit('setSelectedTheme', {theme: getRelevantThemeForOrg(item, false, '.megaphon-app'), selector: '.megaphon-app' }, { root: true });
              }
              else {
                // setDynamicStylingThemeEl({...allThemes[0], title: 'Megaphon'}, '.megaphon-app');
                commit('setSelectedTheme', {theme: allThemes[0], selector: '.megaphon-app' }, { root: true });
              }
            }
            return item;
          }
        });
      },
      searchOrganizations({ dispatch }, { filterBy }) {
        return dispatch({
          type: '_Ajax',
          do: async () => organizationService.searchOrganizations(filterBy),
          onSuccess: (orgs) => {
            return orgs;
          }
        });
      }
    }
  },
  undefined,
  organizationService.getEmptyOrganization
);
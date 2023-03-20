import { organizationService } from './services/organization.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

import { $t } from '@/plugins/i18n';

const initState = () => ({
  ...basicStoreService.initState()
});

const basicStore = basicStoreService.createSimpleCrudStore(initState);

const _organizationStore = {
  namespaced: true,
  state: basicStore.state,
  getters: {
    ...basicStore.getters
  },
  mutations: {
    ...basicStore.mutations,
    updateOrgStatus(state, { organizationId, newStatus }) {
      const doUpdateSttatus = (org) => org.loggedAccountData.status = newStatus;
      if (state.selectedItem?._id === organizationId) doUpdateSttatus(state.selectedItem);
      // const idxIdList = state.data.items.find(c => c._id === organizationId);
      // if (idxIdList !== -1) doUpdateSttatus(state.data.items[idxIdList]);
    },
    updateOrgRoles(state, { organizationId, accountId, roles }) {
      const doUpdateSttatus = (org) => org.members.find(c => c._id === accountId).roles = roles;
      if (state.selectedItem?._id === organizationId) doUpdateSttatus(state.selectedItem);
    }
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadOrganizations({ commit, dispatch }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const organizationsRes = await organizationService.query(filterBy);
          return organizationsRes;
        },
        onSuccess: (data) => commit({ type: 'setData', data })
      });
    },
    async loadOrganization({ commit, dispatch }, { id }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.get(id),
        onSuccess: (organization) => commit({ type: 'setSelectedItem', item: organization })
      });
    },
    async removeOrganization({ commit, dispatch }, { id, toConfirm = true }) {
      if (toConfirm) {
        if (!await alertService.Confirm($t('organization.alerts.confirmRemoveOrg'))) return;
      }
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.remove(id),
        onSuccess: () => alertService.toast({type: 'safe', msg: `${$t('organization.alerts.removedSuccess')}! id: ${id}`})
      });
    },
    async saveOrganization({ commit, dispatch }, { organization }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.save(organization),
        onSuccess: (data) => {
          alertService.toast({type: 'safe', msg: `${$t('organization.alerts.savedSuccess')}! id: ${data._id}`});
          if (!organization._id) {
            commit('auth/addOrg', { organization: { ...data, roles: ['creator', 'admin'] } }, { root: true });
          }
        }
      });
    },


    async inviteAccount({ commit, dispatch }, { organizationId, accountId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.inviteAccount(organizationId, accountId),
        onSuccess: () => alertService.toast({type: 'safe', msg: `${$t('organization.alerts.invetationSentSuccess')}!`})
      });
    },
    async updateAccountStatus({ commit, dispatch, getters }, { organizationId, accountId, newStatus }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.updateAccountStatus(organizationId, accountId, newStatus),
        onSuccess: (data) => {
          commit({ type: 'updateOrgStatus', organizationId, newStatus });
          commit('auth/updateOrgStatus', { organizationId, newStatus }, { root: true });
        }
      });
    },
    async updateAccountRole({ commit, dispatch, getters }, { organizationId, accountId, roles }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.updateAccountRole(organizationId, accountId, roles),
        onSuccess: (data) => {
          commit({ type: 'updateOrgRoles', organizationId, accountId, roles });
        }
      });
    },
    async removeAccount({ commit, dispatch, getters }, { organizationId, accountId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => organizationService.removeAccount(organizationId, accountId),
        onSuccess: (data) => {}
      });
    },
  }
}

export const organizationStore = { organization: _organizationStore };
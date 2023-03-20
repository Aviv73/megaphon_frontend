import { accountService } from './services/account.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

import { $t } from '@/plugins/i18n';

const initState = () => ({
  ...basicStoreService.initState()
});

const basicStore = basicStoreService.createSimpleCrudStore(initState);

export const _accountStore = {
  namespaced: true,
  state: basicStore.state,
  getters: {
    ...basicStore.getters
  },
  mutations: {
    ...basicStore.mutations
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadAccounts({ commit, dispatch }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const accountsRes = await accountService.query(filterBy);
          return accountsRes;
        },
        onSuccess: (data) => commit({ type: 'setData', data })
      });
    },
    async loadAccount({ commit, dispatch }, { id }) {
      return dispatch({
        type: '_Ajax',
        do: async () => accountService.get(id),
        onSuccess: (account) => commit({ type: 'setSelectedItem', item: account })
      });
    },
    async removeAccount({ commit, dispatch }, { id }) {
      if (!await alertService.Confirm($t('account.alerts.confirmRemove'))) return;
      return dispatch({
        type: '_Ajax',
        do: async () => accountService.remove(id),
        onSuccess: () => alertService.toast({type: 'safe', msg: `${$t('account.alerts.removeSuccess')} id: ${id}`})
      });
    },
    async saveAccount({ commit, dispatch, getters }, { account }) {
      return dispatch({
        type: '_Ajax',
        do: async () => accountService.save(account),
        onSuccess: (savedAccount) => {
          commit({ type: 'saveItem', item: savedAccount });
          alertService.toast({type: 'safe', msg: `${$t('account.alerts.savedAccountSuccess')} id: ${account._id}`});
          const loggedUser = this.getters['auth/loggedUser'];
          if (account._id === loggedUser?._id) this.commit({ type: 'auth/setLoggedUser', user: savedAccount });
        }
      });
    }
  }
}

export const accountStore = { account: _accountStore };
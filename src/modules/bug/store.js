import { bugService } from './services/bug.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

import { $t } from '@/plugins/i18n';

const initState = () => ({
  ...basicStoreService.initState()
});

const basicStore = basicStoreService.createSimpleCrudStore(initState);

export const _bugStore = {
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
    async loadBugs({ commit, dispatch }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const accountsRes = await bugService.query(filterBy);
          return accountsRes;
        },
        onSuccess: (data) => commit({ type: 'setData', data })
      });
    },
    async loadBug({ commit, dispatch }, { id }) {
      return dispatch({
        type: '_Ajax',
        do: async () => bugService.get(id),
        onSuccess: (item) => commit({ type: 'setSelectedItem', item })
      });
    },
    async removeBug({ commit, dispatch }, { id }) {
      if (!await alertService.Confirm($t('bug.alerts.confirmRemove'))) return;
      return dispatch({
        type: '_Ajax',
        do: async () => bugService.remove(id),
        onSuccess: () => alertService.toast({type: 'safe', msg: `${$t('bug.alerts.removeSuccess')} id: ${id}`})
      });
    },
    async saveBug({ commit, dispatch }, { bug }) {
      return dispatch({
        type: '_Ajax',
        do: async () => bugService.save(bug),
        onSuccess: (item) => {
          commit({ type: 'saveItem', item });
          alertService.toast({type: 'safe', msg: bug._id? `${$t('bug.alerts.savedBugSuccess')} id: ${bug._id}` : $t('bug.alerts.reportBugSuccess')+'!'})
        }
      });
    }
  }
}

export const bugStore = { bug: _bugStore };
import { alertService } from '@/apps/common/modules/common/services/alert.service'
import { delay } from '@/apps/common/modules/common/services/util.service';

import { $t } from '@/plugins/i18n';

const initFilterBy = (filterParams = [], sortParams = []) => ({
  filter: {
    search: '',
    // params: {}
    // params: filterParams.reduce((acc, c) => ({...acc, [c]: undefined}), {})
    params: filterParams.reduce((acc, c) => ({...acc, [c]: ''}), {})
  },
  pagination: {
    page: 0,
    limit: 50,
  },
  // sort: {},
  sort: sortParams.reduce((acc, c) => ({...acc, [c]: undefined}), {}),
  simpleSort: ''
});

const initState = () => ({
  data: { items: [], total: 0},
  selectedItem: null,
  filterBy: initFilterBy(),
  isLoading: false
});

async function StoreAjax({ commit, dispatch }, { do: toDo, onSuccess, onError, dontDelay = false, loading = true }) {
  try {
    if (loading) commit({ type: 'setLoading', val: true });
    // if (!dontDelay) await delay(700);
  
    const res = await toDo();
    if (res.err) {
      if (onError) onError(res);
      else throw res;
    }
    else if (onSuccess) onSuccess(res);
  
    if (loading) commit({ type: 'setLoading', val: false });
    
    if (typeof res === 'object') return JSON.parse(JSON.stringify(res));
    return res;
  } catch(err) {
    if (err.err && onError) onError(err);
    // else alertService.toast({type: 'danger', msg: `Error ${err.status || 500}: ${err.err || err.message || err.msg || err.error || 'internal error'}`})
    else alertService.toast({type: 'danger', msg: `Error ${err.status || 500}: ${$t(err.err) || err.err || err.message || err.msg || err.error || 'internal error'}`})
    setTimeout(() => {
      if (loading) commit({ type: 'setLoading', val: false });
    }, 3000);
    throw err;
  }
}

const createSimpleCrudStore = (_initState = initState, service = {}, moduleName = 'item') => {
  return {
    namespaced: true,
    state: _initState(),
    getters: {
      data: (state) => state.data,
      items: (state) => state.data.items,
      total: (state) => state.data.total,
      selectedItem: (state) => state.selectedItem,
      filterBy: (state) => state.filterBy,
      isLoading: (state) => state.isLoading,
    },
    mutations: {
      setProp(state, { key, val }) {
        state[key] = val;
      },
      setData(state, { data }) {
        state.data = data;
      },
      setSelectedItem(state, { item }) {
        state.selectedItem = item;
      },
      removeItem(state, { id }) {
        const idx = state.data.items.findIndex(c => c._id === id);
        if (idx !== -1) {
          state.data.items.splice(idx, 1);
          state.data.total--;
        }
        if (state.selectedItem?._id === id) this.selectedItem = null;
      },
      setFilterBy(state, { filterBy }) {
        state.filterBy = filterBy;
      },
      setLoading(state, { val }) {
        state.isLoading = val;
      },
      resetState(state) {
        const newState = _initState();
        for (let key in state) state[key] = newState[key];
      },
      saveItem(state, { item }) {
        const idx = state.data.items.findIndex(c => c._id === item._id);
        if (idx === -1) state.data.items.unshift(item);
        else state.data.items.splice(idx, 1, item);
        if (state.selectedItem?._id === item._id) this.selectedItem = item;
      }
    },
    actions: {
      _Ajax: StoreAjax,
      async loadItems({ commit, dispatch, getters }, { filterBy, organizationId }) {
        return dispatch({
          type: '_Ajax',
          do: async () => {
            if (filterBy) commit({ type: 'setFilterBy', filterBy });
            const shoppingListsRes = await service.query(getters.filterBy, organizationId);
            return shoppingListsRes;
          },
          onSuccess: (data) => commit({ type: 'setData', data })
        });
      },
      async loadItem({ commit, dispatch }, { id, organizationId }) {
        commit({ type: 'setSelectedItem', item: null });
        return dispatch({
          type: '_Ajax',
          do: async () => service.get(id, organizationId),
          onSuccess: (item) => commit({ type: 'setSelectedItem', item })
        });
      },
      async removeItem({ commit, dispatch, getters }, { id, organizationId, reload = false }) {
        if (!await alertService.Confirm($t(`${moduleName}.alerts.confirmRemove`))) return;
        return dispatch({
          type: '_Ajax',
          do: async () => service.remove(id, organizationId),
          onSuccess: () => {
            commit({ type: 'removeItem', id });
            alertService.toast({type: 'safe', msg: `${$t(`${moduleName}.alerts.removeSuccess`)}! id: ${id}`});
            if (reload) dispatch({ type: 'loadItems', organizationId, filterBy: getters.filterBy });
          }
        });
      },
      async saveItem({ commit, dispatch }, { item, organizationId, loading }) {
        return dispatch({
          type: '_Ajax',
          loading,
          do: async () => service.save(item, organizationId),
          onSuccess: (item) => {
            alertService.toast({type: 'safe', msg: `${$t(`${moduleName}.alerts.savedSuccess`)}! id: ${item._id}`})
            commit({ type: 'saveItem', item });
          }
        });
      },
    }
  }
}

export const basicStoreService = {
  initFilterBy,
  StoreAjax,
  initState,
  createSimpleCrudStore
}
import { httpService } from '@/apps/common/modules/common/services/http.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import { delay } from '@/apps/common/modules/common/services/util.service';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

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

async function StoreAjax({ commit, dispatch, getters }, { do: toDo, onSuccess, onError, dontDelay = false, loading = true, dontSet = false, silent = false }) {
  try {
    if (loading) commit({ type: 'setLoading', val: true });
    // if (!dontDelay) await delay(700);
  
    let res = await toDo();
    if (res.err) {
      // if (onError) onError(res);
      throw res;
    }
    else if (onSuccess) res = await onSuccess(res);
  
    if (loading) commit({ type: 'setLoading', val: false });
    
    if (typeof res === 'object') return JSON.parse(JSON.stringify(res));
    return res;
  } catch(err) {
    console.log(err);
    if (err?.needs2FactorAuth) {
      evEmmiter.emit('needs_2_factor_auth', undefined, err.comunicationMethods);
      throw err;
      return;
    }
    if (err.err && onError) onError(err);
    else if (!silent) alertService.toast({type: 'danger', msg: /*`Error ${err.status || 500}: + `*/ `${$t(err.err) || err.err || err.message || err.msg || err.error || 'internal error'}`});
    // setTimeout(() => {
    if (loading) commit({ type: 'setLoading', val: false });
    // }, 3000);
    console.log(err);
    throw err;
  }
}

const createSimpleCrudStore = (moduleName = 'item', _initState = initState, storeData = {}, service, getEmptyItemCb) => {
  if (!service) service = createDefaultService(moduleName, getEmptyItemCb);
  const store = {
    namespaced: true,
    state: _initState(),
    getters: {
      service: () => service,
      moduleName: () => moduleName,
      data: (state) => state.data,
      items: (state) => state.data.items,
      total: (state) => state.data.total,
      selectedItem: (state) => state.selectedItem,
      filterBy: (state) => state.filterBy,
      isLoading: (state) => state.isLoading,
      ...(storeData.getters || {})
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
        state.filterBy = JSON.parse(JSON.stringify(filterBy));
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
      },
      resetFilter(state) {
        const newFilter = _initState().filterBy;
        state.filterBy = newFilter;
      },
      ...(storeData.mutations || {})
    },
    actions: {
      _Ajax: StoreAjax,
      async loadItems({ commit, dispatch, getters }, { filterBy, organizationId, dontSet = false, silent = false }) {
        if (!dontSet) commit({ type: 'setData', data: {items:[], total: 0} });
        return dispatch({
          type: '_Ajax',
          do: async () => {
            // if (organizationId) {
            //   if (filterBy) filterBy.organizationId = organizationId;
            //   else filterBy = { organizationId };
            // }
            if (filterBy) commit({ type: 'setFilterBy', filterBy });
            const itemsRes = await service.query(getters.filterBy, organizationId);
            return itemsRes;
          },
          onSuccess: (data) => {
            if (!dontSet) commit({ type: 'setData', data });
            return data;
          },
          dontSet,
          silent
        });
      },
      async loadItem({ commit, dispatch }, { id, organizationId, dontSet = false, queryParams = {}, silent = false }) {
        if (!dontSet) commit({ type: 'setSelectedItem', item: null });
        return dispatch({
          type: '_Ajax',
          do: async () => service.get(id, organizationId, queryParams),
          onSuccess: (item) => {
            if (!dontSet) commit({ type: 'setSelectedItem', item })
            return item;
          },
          dontSet,
          silent
        });
      },
      async removeItem({ commit, dispatch, getters }, { id, organizationId, reload = false, dontSet = false, silent = false }) {
        if (!await alertService.Confirm($t(`${moduleName}Locales.alerts.confirmRemove`))) throw new Error('Dont want to remove!');
        return dispatch({
          type: '_Ajax',
          do: async () => service.remove(id, organizationId),
          onSuccess: () => {
            if (!dontSet) commit({ type: 'removeItem', id });
            // alertService.toast({type: 'safe', msg: `${$t(`${moduleName}Locales.alerts.removeSuccess`)}! id: ${id}`});
            if (!silent) alertService.toast({type: 'safe', msg: `${$t(`${moduleName}Locales.alerts.removeSuccess`)}!`});
            if (reload) dispatch({ type: 'loadItems', organizationId, filterBy: getters.filterBy });
          },
          dontSet,
          silent
        });
      },
      async saveItem({ commit, dispatch }, { item, organizationId, loading, dontSet = false, silent = false }) {
        return dispatch({
          type: '_Ajax',
          loading,
          do: async () => service.save(item, organizationId),
          onSuccess: (item) => {
            // alertService.toast({type: 'safe', msg: `${$t(`${moduleName}Locales.alerts.savedSuccess`)}! id: ${item._id}`})
            if (!silent) alertService.toast({type: 'safe', msg: `${$t(`${moduleName}Locales.alerts.savedSuccess`)}!`})
            if (!dontSet) commit({ type: 'saveItem', item });
            return item;
          },
          dontSet,
          silent
        });
      },
      ...(storeData.actions || {})
    }
  }
  return { [moduleName]: store };
}


function createDefaultService(moduleName, getEmptyItemCb = () => ({})) {
  const _orgSpace = (orgId) => orgId? `${orgId}/` : '';
  const service = {
   query: (filterBy, organizationId) => {
     return httpService.get(`${moduleName}/${_orgSpace(organizationId)}`, filterBy);
   },
   get: (id, organizationId, queryParams) => {
     if (!id) return getEmptyItemCb();
     return httpService.get(`${moduleName}/${_orgSpace(organizationId)}${id}`, queryParams);
   },
   add: (item, organizationId) => {
     return httpService.post(`${moduleName}/${_orgSpace(organizationId)}`, item);
   },
   update: (item, organizationId) => {
     return httpService.put(`${moduleName}/${_orgSpace(organizationId)}`, item);
   },
   remove: (id, organizationId) => {
     return httpService.delete(`${moduleName}/${_orgSpace(organizationId)}${id}`);
   },
   save: (item, organizationId) => {
     return item._id? service.update(item, organizationId) : service.add(item, organizationId);
   }
  }
  return service;
}


export const basicStoreService = {
  initFilterBy,
  StoreAjax,
  initState,
  createSimpleCrudStore,
  createDefaultService
}
import { shoppingListService } from './services/shoppingList.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';

export const _shoppingListStore = {
  namespaced: true,
  state: basicStoreService.initState(),
  getters: {
    shoppingListsData: (state) => state.data,
    shoppingLists: (state) => state.data.items,
    totalShoppingList: (state) => state.data.total,
    selectedShoppingList: (state) => state.selectedItem,
    filterBy: (state) => state.filterBy,
    isLoading: (state) => state.isLoading,
  },
  mutations: {
    setProp(state, { key, val }) {
      state[key] = val;
    },
    setShoppingList(state, { data }) {
      state.data = data;
    },
    setSelectedShoppingList(state, { shoppingList }) {
      state.selectedItem = shoppingList;
    },
    removeShoppingList(state, { id }) {
      const idx = state.data.items.findIndex(c => c._id === id);
      if (idx !== -1) {
        state.data.items.splice(idx, 1);
        state.data.total++;
      }
    },
    setFilterBy(state, { filterBy }) {
      state.filterBy = filterBy;
    },
    setLoading(state, { val }) {
      state.isLoading = val;
    },
    resetState(state) {
      const newState = basicStoreService.initState();
      for (let key in state) state[key] = newState[key];
    },
    saveShoppingList(state, { shoppingList }) {
      const idx = state.data.items.findIndex(c => c._id === shoppingList._id);
      if (idx === -1) state.data.items.unshift(shoppingList);
      else state.data.items.splice(idx, 1, shoppingList);
    }
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadShoppingLists({ commit, dispatch }, { filterBy, organizationId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const shoppingListsRes = await shoppingListService.query(filterBy, organizationId);
          return shoppingListsRes;
        },
        onSuccess: (data) => commit({ type: 'setShoppingList', data })
      });
    },
    async loadShoppingList({ commit, dispatch }, { id, organizationId }) {
      commit({ type: 'setSelectedShoppingList', shoppingList: null });
      return dispatch({
        type: '_Ajax',
        do: async () => shoppingListService.get(id, organizationId),
        onSuccess: (shoppingList) => commit({ type: 'setSelectedShoppingList', shoppingList })
      });
    },
    async removeShoppingList({ commit, dispatch }, { id, organizationId }) {
      if (!await alertService.Confirm('Are you sure you want to remove this shoppingList?')) return;
      return dispatch({
        type: '_Ajax',
        do: async () => shoppingListService.remove(id, organizationId),
        onSuccess: () => {
          commit({ type: 'removeShoppingList', id });
          alertService.toast({type: 'success', msg: `shoppingList removed successfully! id: ${id}`});
        }
      });
    },
    async saveShoppingList({ commit, dispatch }, { shoppingList, organizationId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => shoppingListService.save(shoppingList, organizationId),
        onSuccess: (shoppingList) => {
          // alertService.toast({type: 'success', msg: `shoppingList saved successfully! id: ${data._id}`})
          // commit({ type: 'saveShoppingList', shoppingList });
        }
      });
    },
  }
}

export const shoppingListStore = { shoppingList: _shoppingListStore };
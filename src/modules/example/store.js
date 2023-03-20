import { exampleService } from './services/example.service';
import { alertService } from '@/modules/common/services/alert.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';


const initState = () => ({
  data: { items: [], total: 0},
  selectedItem: null,
  // filterBy: initFilter(),
  filterBy: basicStoreService.initFilterBy(),
  isLoading: false
});

export const _exampleStore = {
  namespaced: true,
  state: initState(),
  getters: {
    itemsData: (state) => state.data,
    items: (state) => state.data.items,
    totalItems: (state) => state.data.total,
    selectedItem: (state) => state.selectedItem,
    filterBy: (state) => state.filterBy,
    isLoading: (state) => state.isLoading,
  },
  mutations: {
    setProp(state, { key, val }) {
      state[key] = val;
    },
    setItems(state, { data }) {
      state.data = data;
    },
    setSelectedItem(state, { item }) {
      state.selectedItem = item;
    },
    removeItem(state, { id }) {
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
      const newState = initState();
      for (let key in state) state[key] = newState[key];
    }
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadItems({ commit, dispatch }, { filterBy }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          if (filterBy) commit({ type: 'setFilterBy', filterBy });
          const itemsRes = await exampleService.query(filterBy);
          return itemsRes;
        },
        onSuccess: (data) => commit({ type: 'setItems', data })
      });
    },
    async loadItem({ commit, dispatch }, { id }) {
      return dispatch({
        type: '_Ajax',
        do: async () => exampleService.get(id),
        onSuccess: (item) => commit({ type: 'setSelectedItem', item })
      });
    },
    async removeItem({ commit, dispatch }, { id }) {
      if (!await alertService.Confirm('Are you sure you want to remove this item?')) return;
      return dispatch({
        type: '_Ajax',
        do: async () => exampleService.remove(id),
        // onSuccess: () => commit({ type: 'removeItem', id })
        onSuccess: () => alertService.toast({type: 'success', msg: `Item removed successfully! id: ${id}`})
      });
    },
    async saveItem({ commit, dispatch }, { item }) {
      return dispatch({
        type: '_Ajax',
        do: async () => exampleService.save(item),
        // onSuccess: () => commit({ type: 'saveItem', id })
        onSuccess: (data) => alertService.toast({type: 'success', msg: `Item saved successfully! id: ${data._id}`})
      });
    },
  }
}

export const exampleStore = { example: _exampleStore };

// function deepIterateWithQueryParams(obj, queries, isFechFromQuery = false) {
//   deepIterateWithObj(obj, (key, val) => {
//     if (isFechFromQuery) setDeepVal(obj, key, queries[key]);
//     else query[key] = val;
//   });
// }
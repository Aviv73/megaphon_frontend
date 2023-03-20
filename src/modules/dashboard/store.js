import { dashboardService } from './services/dashboard.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';


const initState = () => ({
  data: null,
  isLoading: false
});

export const _dashboardStore = {
  namespaced: true,
  state: initState(),
  getters: {
    data: (state) => state.data,
    isLoading: (state) => state.isLoading,
  },
  mutations: {
    setData(state, { data }) {
      state.data = data;
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
    async loadDashboardData({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          const dashboardRes = await dashboardService.getDashboardData();
          return dashboardRes;
        },
        onSuccess: (data) => commit({ type: 'setData', data }),
      });
    },
    async loadDashboardData({ commit, dispatch }, { organizationId, filter }) {
      return dispatch({
        type: '_Ajax',
        do: () => dashboardService.loadDashboardData(organizationId, filter),
        onSuccess: (data) => commit({ type: 'setData', data }),
      });
    }
  }
}

export const dashboardStore = { dashboard: _dashboardStore };
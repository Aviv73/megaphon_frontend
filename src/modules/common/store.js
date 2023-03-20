const initState = () => ({
  isLoading: true,
  error: ''
});

export const _commonStore = {
  state: initState(),
  getters: {
    isRootLoading: (state) => state.isLoading,
    rootError: (state) => state.error,
  },
  mutations: {
    setRootLoading(state, { val }) {
      state.isLoading = val;
    },
    setError(state, { err }) {
      state.error = err;
    },
    resetCommonState(state) {
      const newState = initState();
      for (let key in state) state[key] = newState[key];
    }
  },
  actions: {
    resetState({ commit }) {
      commit('account/resetState');
      commit('auth/resetState');
      commit('example/resetState');
      commit('activity/resetState');
      commit('comment/resetState');
      commit('post/resetState');
      commit('shoppingList/resetState');
      commit('organization/resetState');
      commit('dashboard/resetState');
      // commit('settings/resetState');
    }
  }
}

export const commonStore = { common: _commonStore };
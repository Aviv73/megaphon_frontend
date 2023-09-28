const initState = () => ({
  isLoading: true,
  error: ''
});

export const _commonStore = {
  state: initState(),
  getters: {
    isRootLoading: (state) => state.isLoading,
    rootError: (state) => state.error,
    mainLinkRouteTo(state, getters) {
      // return { name: 'ReleasePage' };
      const initReleaseId = getters['release/initReleaseId'];
      return initReleaseId
        ? {name: 'ReleaseDetails', params: {id: initReleaseId} }
        : { name: 'ReleasePage' }
    },
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
      commit('release/resetState');
    }
  }
}

export const commonStore = { common: _commonStore };
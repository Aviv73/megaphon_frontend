import { msgService } from './services/msg.service';
import { basicStoreService } from '@/modules/common/services/basic-store.service';


const initState = () => ({
  msgs: null,
  isLoading: false
});

export const _edStore = {
  namespaced: true,
  state: initState(),
  getters: {
    msgs: (state) => state.msgs,
    isLoading: (state) => state.isLoading,
  },
  mutations: {
    setMsgs(state, { msgs }) {
      state.msgs = msgs;
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
    async loadMsgs({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          const msgsMapRes = await msgService.getMsgs();
          return msgsMapRes;
        },
        onSuccess: (msgs) => commit({ type: 'setMsgs', msgs }),
        onError: (err) => {} // NOOP;
      });
    },
    async updateMsgs({ commit, dispatch }, { msgs }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          const msgsMapRes = await msgService.updateMsgs(msgs);
          return msgsMapRes;
        },
        onSuccess: (newMsgs) => commit({ type: 'setMsgs', msgs: newMsgs }),
        // onError: (err) => {} // NOOP;
      });
    }
  }
}

export const edStore = { ed: _edStore };
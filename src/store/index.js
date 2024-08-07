import Vue from 'vue'
import Vuex from 'vuex'
import { settingsStore } from '../apps/common/modules/settings/store';

// import commonStore from '../apps/common/store'
// import selectedAppData from '../apps/index.js';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isScreenWide: false,
    selectedAppData: null
  },
  getters: {
    isScreenWide(state) {
      return state.isScreenWide;
    },
    selectedAppData(state) {
      return state.selectedAppData;
    }
  },
  mutations: {
    setIsScreenWide(state) {
      state.isScreenWide = window.innerWidth > 900; // small-screen-breake
    },
    setSelectedAppData(state, { selectedAppData }) {
      state.selectedAppData = selectedAppData;
    }
  },
  actions: {
  },
  modules: {
    // initializing common store on App.vue so it can be removed;
    ...settingsStore,
    // ...commonStore,
    // ...selectedAppData.store
  }
})

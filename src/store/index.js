import Vue from 'vue'
import Vuex from 'vuex'

import commonStore from '../apps/common/store'
import selectedAppData from '../apps/index.js';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isScreenWide: false
  },
  getters: {
    isScreenWide(state) {
      return state.isScreenWide;
    }
  },
  mutations: {
    setIsScreenWide(state) {
      state.isScreenWide = window.innerWidth > 900; // small-screen-breake
    }
  },
  actions: {
  },
  modules: {
    ...commonStore,
    ...selectedAppData.store
  }
})

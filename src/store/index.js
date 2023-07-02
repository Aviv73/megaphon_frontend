import Vue from 'vue'
import Vuex from 'vuex'

import commonStore from '../apps/common/store'
import selectedAppData from '../apps/index.js';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    ...commonStore,
    ...selectedAppData.store
  }
})

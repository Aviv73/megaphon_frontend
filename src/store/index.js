import Vue from 'vue'
import Vuex from 'vuex'

import { commonStore } from '@/modules/common/store'
import { releaseStore } from '@/modules/release/store'
import { settingsStore } from '@/modules/settings/store'


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
    ...releaseStore,
    ...settingsStore
  }
})

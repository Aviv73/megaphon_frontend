import Vue from 'vue'
import Vuex from 'vuex'
import { settingsStore } from '../apps/common/modules/settings/store';
import { setDynamicStylingThemeEl } from '../apps/common/modules/common/services/dynamicPages.service';

// import commonStore from '../apps/common/store'
// import selectedAppData from '../apps/index.js';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isScreenWide: false,
    selectedAppData: null,
    rootOrg: null,
    selectedTheme: null
  },
  getters: {
    isScreenWide(state) {
      return state.isScreenWide;
    },
    selectedAppData(state) {
      return state.selectedAppData;
    },
    rootOrg(state) {
      return state.rootOrg;
    },
    selectedTheme(state) {
      return state.selectedTheme;
    }
  },
  mutations: {
    setIsScreenWide(state) {
      state.isScreenWide = window.innerWidth > 900; // small-screen-breake
    },
    setSelectedAppData(state, { selectedAppData }) {
      state.selectedAppData = selectedAppData;
    },
    setRootOrg(state, { org }) {
      state.rootOrg = org;
    },
    setSelectedTheme(state, { theme, selector }) {
      state.selectedTheme = theme;
      setDynamicStylingThemeEl(theme, selector);
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

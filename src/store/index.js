import Vue from 'vue'
import Vuex from 'vuex'
import { settingsStore } from '../apps/common/modules/settings/store';
import { dynamicCssPagesService } from '../apps/common/modules/common/services/dynamicPages.service';
import { httpService } from '@/apps/common/modules/common/services/http.service';

// import commonStore from '../apps/common/store'
// import selectedAppData from '../apps/index.js';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isScreenWide: false,
    selectedAppData: null,
    rootOrg: null,
    selectedTheme: null,
    envManagement: {},
    fetchedLocales: {}
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
    },
    envManagement(state) {
      return state.envManagement;
    },
    fetchedLocales(state) {
      return state.fetchedLocales;
    }
  },
  mutations: {
    setIsScreenWide(state) {
      state.isScreenWide = window.innerWidth > 1100; // small-screen-breake
    },
    setSelectedAppData(state, { selectedAppData }) {
      state.selectedAppData = selectedAppData;
    },
    setRootOrg(state, { org }) {
      state.rootOrg = org;
    },
    setTheme(state, { theme, selector }) {
      state.selectedTheme = theme;
    },
    setTheme(state, { theme, selector }) {
      state.selectedTheme = theme;
    },
    setEnvManagement(state, { envManagement }) {
      state.envManagement = envManagement;
    },
    setFetchedLocales(state, { locales }) {
      state.fetchedLocales = locales;
    }
  },
  actions: {
    setSelectedTheme({commit, rootGetters}, { theme, selector }) {
      commit({type: 'setTheme', theme})
      dynamicCssPagesService.setDynamicStylingThemeEl(theme, selector, rootGetters['settings/uiConfig']?.remSize);
    },
    async loadEnvManagment({commit}) {
      const envManagement = await httpService.get('management/envManagement');
      commit({type: 'setEnvManagement', envManagement});
    },
    async loadLocales({commit}) {
      const locales = await httpService.get('management/locales');
      commit({type: 'setFetchedLocales', locales});
    },
  },
  modules: {
    // initializing common store on App.vue so it can be removed;
    ...settingsStore,
    // ...commonStore,
    // ...selectedAppData.store
  }
})

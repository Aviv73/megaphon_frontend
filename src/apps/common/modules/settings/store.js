import { settingsService } from './services/settings.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service'
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

const defaultUiConfig = {
  locale: 'he',
  theme: 'light',
  accessabilityMode: false,
  remSize: 15,
  themesByOrg: {
    // [orgId]: { [appName]: [themeName] }
    default: {}
  }
}

const initState = () => ({
  settings: null,
  isLoading: false,
  config: null,

  uiConfig: localStorage.uiConfig ? {...defaultUiConfig, ...JSON.parse(localStorage.uiConfig)} : {...defaultUiConfig}
});

export const _settingsStore = {
  namespaced: true,
  state: initState(),
  getters: {
    settings: (state) => state.settings,
    config: (state) => state.config,
    isLoading: (state) => state.isLoading,
    uiConfig: (state) => state.uiConfig
  },
  mutations: {
    setSettings(state, { settings }) {
      state.settings = settings;
    },
    setLoading(state, { val }) {
      state.isLoading = val;
    },
    resetState(state) {
      const newState = initState();
      for (let key in state) state[key] = newState[key];
    },
    setConfig(state, { config }) {
      state.config = config;
    },

    saveUiConfig(state, { config }) {
      state.uiConfig = {...config},
      localStorage.uiConfig = JSON.stringify(config);
    }
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async loadSettings({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          const settingsRes = await settingsService.getSettings();
          return settingsRes;
        },
        onSuccess: (settings) => commit({ type: 'setSettings', settings }),
        onError: (err) => {}, // NOOP;,
        dontDelay: true
      });
    },
    async updateSettings({ commit, dispatch }, { settings }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          const settingsRes = await settingsService.updateSettings(settings);
          return settingsRes;
        },
        onSuccess: (newSettings) => commit({ type: 'setSettings', settings: newSettings }),
        // onError: (err) => {} // NOOP;
        dontDelay: true
      });
    },

    async loadConfig({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => {
          const configRes = await settingsService.getConfig();
          return configRes;
        },
        onSuccess: (config) => commit({ type: 'setConfig', config }),
        onError: (err) => {}, // NOOP;,
        dontDelay: true
      });
    },

    saveUiConfig({ commit }, { config }) {
      commit({ type: 'saveUiConfig', config });
    }
  }
}

export const settingsStore = { settings: _settingsStore };
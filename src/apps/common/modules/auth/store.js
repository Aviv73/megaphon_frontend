import { authService } from './services/auth.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

import { $t } from '@/plugins/i18n';
import { organizationService } from '../../../megaphonApp/modules/organization/services/organization.service';

const initState = () => ({
  loggedUser: null,
  isLoading: false
});

export const _authStore = {
  namespaced: true,
  state: initState(),
  getters: {
    isLoading: (state) => state.isLoading,
    loggedUser: (state) => state.loggedUser,
    isAdmin: (state) => state.loggedUser?.role === 'admin' || state.loggedUser?.roles?.includes?.('admin'),
    // isWatchOnly: (state) => state.loggedUser?.role === 'client' || (state.loggedUser?.roles?.includes?.('client') && (state.loggedUser.roles.length === 1)),
    // isWatchOnly: (state) => true || state.loggedUser?.organizations.every(org => (org.roles?.length === 1) && (org.roles[0] === 'client')),
    isWatchOnly: (state) => state.loggedUser?.organizations.every(org => organizationService.isUserWatchOnly(org._id, state.loggedUser)),
  },
  mutations: {
    setLoading(state, { val }) {
      state.isLoading = val;
    },

    setLoggedUser(state, { user }) {
      state.loggedUser = user;
    },
    resetState(state) {
      const newState = initState();
      for (let key in state) state[key] = newState[key];
    },
    updateOrgStatus(state, { organizationId, newStatus }) {
      state.loggedUser.organizations.find(c => c._id === organizationId).status = newStatus;
    },
    addOrg(state, { organization }) {
      // const idx = state.loggedUser.organizations.find(c => c._id === organization._id);
      const { _id, name, status = 'approved', roles = ['creator', 'admin'], approverId = state.loggedUser._id } = organization
      const itemToPush = {organizationId: _id, name, status, roles, approverId};
      state.loggedUser.organizations.push(itemToPush);
    }
  },
  actions: {
    _Ajax: basicStoreService.StoreAjax,
    async login({ commit, dispatch }, { cred, organizationId }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.login(cred, organizationId),
        onSuccess: (res) => {
          if (res.user) {
            commit({ type: 'setLoggedUser', user: res.user });
            alertService.toast({type: 'safe', msg: `${$t('auth.alerts.welcomeBack')}, ${res.user.firstName} ${res.user.lastName}!`});
          }
          return res;
        }
      });
    },
    async getUserInfo({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.getUserInfo(),
        onSuccess: (user) => {commit({ type: 'setLoggedUser', user })},
        onError: () => {
          localStorage.logged_organization_id = '';
        }
      });
    },
    async logout({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.logout(),
        onSuccess: (res) => {
          commit({ type: 'setLoggedUser', user: null });
          alertService.toast({type: 'safe', msg: $t(`auth.alerts.goodby`)});
          localStorage.logged_organization_id = '';
          dispatch('resetState', {}, { root: true });
        }
      });
    },
    async signup({ commit, dispatch }, { cred }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.signup(cred),
        onSuccess: (res) => {
          commit({ type: 'setLoggedUser', user: res.user });
          alertService.toast({type: 'safe', msg: `${$t(`auth.alerts.welcome`)}, ${res.user.firstName} ${res.user.lastName}!`});
        }
      });
    },
    async sendNewPasswordEmail({ commit, dispatch }, { email }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.sendNewPasswordEmail(email),
        onSuccess: (res) => {
          alertService.toast({type: 'safe', msg: `${$t(`auth.newPasswordSentTo`)}: ${email}!`});
        }
      });
    },
    async finishAuth({ commit, dispatch }, { pass }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.finishAuth(pass),
        onSuccess: (res) => {
          if (res.user) {
            commit({ type: 'setLoggedUser', user: res.user });
            alertService.toast({type: 'safe', msg: `${$t('auth.alerts.welcomeBack')}, ${res.user.firstName} ${res.user.lastName}!`});
          }
          console.log(res);
          return res;
        }
      });
    },
    async makeSecondFactorAuthPass({ commit, dispatch }) {
      return dispatch({
        type: '_Ajax',
        do: async () => authService.makeSecondFactorAuthPass()
      });
    }
  }
}

export const authStore = { auth: _authStore };
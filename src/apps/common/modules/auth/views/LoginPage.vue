<template>
  <div class="auth-page login-page flex column gap20 align-center justify-center width-all">
    <router-link class="btn width-content" :to="{ name: 'SignupPage', query: { endpoint: $route.query.endpoint } }">{{$t('signup')}}</router-link>
    <form @submit.prevent="login" class="simple-form">
      <!-- <img v-if="!rootOrg" class="logo" :src="appLogo" :alt="org?.name || 'Megaphon'"> -->
      <h4>{{$t('login')}}</h4>
      <FormInput type="text" labelholder="authLocales.email" v-model="userCred.email"/>
      <FormInput type="password" labelholder="authLocales.password" v-model="userCred.password"/>
      <div class="flex align-center space-between">
        <button class="btn big primary flex align-center justify-center" :disabled="!isUserValid"><span>{{$t('login')}}</span></button>
      </div>
    </form>
    <ToggleModal>
      <template v-slot:toggler>
        <button class="btn" @click="forgotEmailEmail = userCred.email">{{$t('authLocales.forgotPassword')}}</button>
      </template>
      <template v-slot:content>
        <form @submit.prevent="sendNewPasswordEmail" class="simple-form align-center gap30">
          <h3>{{$t('authLocales.forgotPassword')}}</h3>
          <FormInput labelholder="authLocales.email" v-model="forgotEmailEmail"/>
          <button class="btn big primary">{{$t('authLocales.sendMeNewPassword')}}</button>
        </form>
      </template>
    </ToggleModal>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
import ToggleModal from '../../../../common/modules/common/cmps/ToggleModal.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import appConfig from '../../../../../appConfig';
import Modal from '../../common/cmps/Modal.vue';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';

export default {
  name: 'LoginPage',
  data() {
    return {
      userCred: JSON.parse(localStorage.userCred || 'null') || {
        email: '',
        password: ''
      },
      forgotEmailEmail: '',
      // showFinishAuthModal: false,
      // finishAuthPass: ''
    }
  },
  computed: {
    isUserValid() {
      return this.userCred.email && this.userCred.password;
    },
    appLogo() {
      return this.org?.logo? fixFileSrcToThumbnail(this.org?.logo, this.org) : require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png');
    },
    org() {
      return appConfig.appOrganization || this.$store.getters['organization/selectedItem'];
    },
    rootOrg() {
      return this.$store.getters.rootOrg;
    }
  },
  methods: {
    async login() {
      if (!this.isUserValid) return;
      if (this.userCred.username) delete this.userCred.username;
      localStorage.userCred = JSON.stringify(this.userCred);
      const res = await this.$store.dispatch({ type: 'auth/login', cred: this.userCred, organizationId: appConfig.appOrganization?._id || appConfig.appOrganizationId /*sometimes undefined*/ });
      if (res.needs2FactorAuth) {
        // this.showFinishAuthModal = true;
        evEmmiter.emit('needs_2_factor_auth', '/', res.comunicationMethods);
      }
      else this.$router.push(this.$route.query.endpoint || this.$store.getters['auth/redirectPage'] || '/');
    },
    async sendNewPasswordEmail() {
      await this.$store.dispatch({ type: 'auth/sendNewPasswordEmail', email: this.forgotEmailEmail });
      alertService.toast({type: 'safe', msg: `${this.$t(`authLocales.newPasswordSentTo`)} ${this.forgotEmailEmail}!`});
    }
  },
  components: {
    FormInput,
    ToggleModal,
    Modal
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
</style>
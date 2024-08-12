<template>
  <div class="auth-page login-page flex column gap20 align-center justify-center width-all">
    <router-link class="btn width-content" :to="{name: 'SignupPage'}">{{$t('signup')}}</router-link>
    <form @submit.prevent="login" class="simple-form">
      <img class="logo" :src="appLogo" :alt="org?.name || 'Megaphon'">
      <h4>{{$t('login')}}</h4>
      <FormInput type="text" labelholder="auth.email" v-model="userCred.email"/>
      <FormInput type="password" labelholder="auth.password" v-model="userCred.password"/>
      <div class="flex align-center space-between">
        <button class="btn big primary flex align-center justify-center" :disabled="!isUserValid"><span>{{$t('submit')}}</span></button>
      </div>
    </form>
    <ToggleModal>
      <template v-slot:toggler>
        <button class="btn" @click="forgotEmailEmail = userCred.email">{{$t('auth.forgotPassword')}}</button>
      </template>
      <template v-slot:content>
        <form @submit.prevent="sendNewPasswordEmail" class="simple-form align-center gap30">
          <h3>{{$t('auth.forgotPassword')}}</h3>
          <FormInput labelholder="auth.email" v-model="forgotEmailEmail"/>
          <button class="btn big primary">{{$t('auth.sendMeNewPassword')}}</button>
        </form>
      </template>
    </ToggleModal>
    <Modal :fullScreen="true" v-if="showFinishAuthModal">
      <form @submit.prevent="finishAuth" class="simple-form align-stretch">
        <h4 class="text-center">
          To finish authentication, please open your mobile and enter the password we sent to you
        </h4>
        <FormInput v-model="finishAuthPass" placeholder="token"/>
        <button class="btn big primary">{{$t('submit')}}</button>
      </form>
    </Modal>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
import ToggleModal from '../../../../common/modules/common/cmps/ToggleModal.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import appConfig from '../../../../../appConfig';
import Modal from '../../common/cmps/Modal.vue';
export default {
  name: 'LoginPage',
  data() {
    return {
      userCred: JSON.parse(localStorage.userCred || 'null') || {
        email: '',
        password: ''
      },
      forgotEmailEmail: '',
      showFinishAuthModal: false,
      finishAuthPass: ''
    }
  },
  computed: {
    isUserValid() {
      return this.userCred.email && this.userCred.password;
    },
    appLogo() {
      return this.org?.logoUrl || require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png');
    },
    org() {
      return appConfig.appOrganization || this.$store.getters['organization/selectedItem'];
    }
  },
  methods: {
    async login() {
      if (!this.isUserValid) return;
      if (this.userCred.username) delete this.userCred.username;
      localStorage.userCred = JSON.stringify(this.userCred);
      const res = await this.$store.dispatch({ type: 'auth/login', cred: this.userCred, organizationId: appConfig.appOrganizationId /*sometimes undefined*/ });
      if (res.needs2FactorAuth) {
        this.showFinishAuthModal = true;
      }
      else this.$router.push('/');
    },
    async sendNewPasswordEmail() {
      await this.$store.dispatch({ type: 'auth/sendNewPasswordEmail', email: this.forgotEmailEmail });
      alertService.toast({type: 'safe', msg: `${this.$t(`auth.newPasswordSentTo`)} ${this.forgotEmailEmail}!`});
    },
    async finishAuth() {
      await this.$store.dispatch({ type: 'auth/finishAuth', pass: this.finishAuthPass });
      this.showFinishAuthModal = false;
      this.$router.push('/');
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
.auth-page {
  .simple-form {
    max-width: em(400px);
    gap: rem(10px);
    .logo {
      width: 50%;
    }
  }
}
</style>
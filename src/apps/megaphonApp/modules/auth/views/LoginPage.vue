<template>
  <div class="auth-page login-page flex column gap20 align-center justify-center width-all">
    <router-link class="btn width-content" :to="{name: 'SignupPage'}">{{$t('signup')}}</router-link>
    <form @submit.prevent="login" class="simple-form">
      <img class="logo" :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      <h4>{{$t('login')}}</h4>
      asclmacslacs
      <FormInput type="text" labelholder="account.email" v-model="userCred.email"/>
      <FormInput type="password" labelholder="account.password" v-model="userCred.password"/>
      <div class="flex align-center space-between">
        <button class="btn big primary flex align-center justify-center" :disabled="!isUserValid"><span>{{$t('submit')}}</span></button>
      </div>
    </form>
    <ToggleModal>
      <template v-slot:toggler>
        <button class="btn">{{$t('auth.forgotPassword')}}</button>
      </template>
      <template v-slot:content>
        <form @submit.prevent="sendNewPasswordEmail" class="simple-form align-center gap30">
          <h3>{{$t('auth.forgotPassword')}}</h3>
          <FormInput labelholder="account.email" v-model="forgotEmailEmail"/>
          <button class="btn big primary">{{$t('auth.sendMeNewPassword')}}</button>
        </form>
      </template>
    </ToggleModal>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
import ToggleModal from '../../../../common/modules/common/cmps/ToggleModal.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
export default {
  name: 'LoginPage',
  data() {
    return {
      userCred: JSON.parse(localStorage.userCred || 'null') || {
        email: '',
        password: ''
      },
      forgotEmailEmail: ''
    }
  },
  computed: {
    isUserValid() {
      return this.userCred.email && this.userCred.password;
    }
  },
  methods: {
    async login() {
      if (!this.isUserValid) return;
      localStorage.userCred = JSON.stringify(this.userCred);
      await this.$store.dispatch({ type: 'auth/login', cred: this.userCred });
      this.$router.push('/');
    },
    async sendNewPasswordEmail() {
      await this.$store.dispatch({ type: 'auth/sendNewPasswordEmail', email: this.forgotEmailEmail });
      alertService.toast({type: 'safe', msg: `${this.$t(`auth.newPasswordSentTo`)} ${this.forgotEmailEmail}!`});
    }
  },
  components: {
    FormInput,
    ToggleModal
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
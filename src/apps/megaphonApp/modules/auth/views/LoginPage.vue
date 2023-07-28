<template>
  <div class="login-page flex column gap20 align-center justify-center width-all">
    <!-- <router-link class="btn width-content" :to="{name: 'SignupPage'}">{{$t('signup')}}</router-link> -->
    <form @submit.prevent="login" class="simple-form">
      <img class="logo" :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      <h4>{{$t('login')}}</h4>
      <FormInput type="text" labelholder="account.username" v-model="userCred.username"/>
      <FormInput type="password" labelholder="account.password" v-model="userCred.password"/>
      <button class="btn big primary flex align-center justify-center" :disabled="!isUserValid"><span>{{$t('submit')}}</span></button>
    </form>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
export default {
  name: 'LoginPage',
  data() {
    return {
      userCred: JSON.parse(localStorage.userCred || 'null') || {
        username: '',
        password: ''
      }
    }
  },
  computed: {
    isUserValid() {
      return this.userCred.username && this.userCred.password;
    }
  },
  methods: {
    async login() {
      if (!this.isUserValid) return;
      localStorage.userCred = JSON.stringify(this.userCred);
      await this.$store.dispatch({ type: 'auth/login', cred: this.userCred });
      this.$router.push('/');
    }
  },
  components: {
    FormInput
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.login-page {
  .simple-form {
    max-width: em(400px);
    gap: rem(10px);
    .logo {
      width: 50%;
    }
  }
}
</style>
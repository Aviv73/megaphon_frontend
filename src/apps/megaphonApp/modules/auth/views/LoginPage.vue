<template>
  <div class="login-page flex column gap20">
    <!-- <router-link class="btn width-content" :to="{name: 'SignupPage'}">{{$t('signup')}}</router-link> -->
    <form @submit.prevent="login" class="simple-form">
      <FormInput type="text" labelholder="account.username" v-model="userCred.username"/>
      <FormInput type="password" labelholder="account.password" v-model="userCred.password"/>
      <button class="btn primary" :disabled="!isUserValid">{{$t('submit')}}</button>
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
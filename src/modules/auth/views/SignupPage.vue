<template>
  <div class="signup-page flex column gap20">
    <router-link class="btn width-content" :to="{name: 'LoginPage'}">{{$t('login')}}</router-link>
    <form @submit.prevent="signup" class="simple-form">
      <FormInput type="text" labelholder="account.username" v-model="user.username"/>
      <FormInput type="text" labelholder="account.firstname" v-model="user.firstname"/>
      <FormInput type="text" labelholder="account.lastname" v-model="user.lastname"/>
      <FormInput type="text" labelholder="account.email" v-model="user.email"/>
      <FormInput type="password" labelholder="account.password" v-model="user.password"/>
      <FormInput type="select" labelholder="account.gender" v-model="user.gender" :itemsMap="userGenders"/>
      <button class="btn primary" :disabled="!isUserValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue'
import { accountService } from '@/modules/account/services/account.service';
export default {
  name: 'SignupPage',
  data() {
    return {
      user: accountService.getEmptyAccount()
    }
  },
  computed: {
    isUserValid() {
      const { user } = this;
      return user.username && user.password && user.firstname && user.lastname && user.email;
    },
    userGenders() {
      return this.$store.getters['settings/config'].userGenders;
    }
  },
  methods: {
    async signup() {
      if (!this.isUserValid) return;
      await this.$store.dispatch({ type: 'auth/signup', cred: this.user });
      this.$router.push('/');
    }
  },
  components: {
    FormInput
  }
}
</script>
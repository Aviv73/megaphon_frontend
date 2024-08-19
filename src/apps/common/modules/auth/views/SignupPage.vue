<template>
  <div class="auth-page signup-page flex column gap20 align-center justify-center width-all">
    <router-link class="btn width-content" :to="{name: 'LoginPage'}">{{$t('login')}}</router-link>
    <form @submit.prevent="signup" class="simple-form">
      <img v-if="!rootOrg" class="logo" :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      <h4>{{$t('signup')}}</h4>
      <!-- <FormInput type="text" labelholder="auth.username" v-model="user.username"/> -->
      <FormInput type="text" labelholder="auth.firstname" v-model="user.firstName"/>
      <FormInput type="text" labelholder="auth.lastname" v-model="user.lastName"/>
      <FormInput type="text" labelholder="auth.email" v-model="user.email"/>
      <FormInput type="text" labelholder="auth.password" v-model="user.password"/>
      <FormInput type="text" labelholder="auth.confirmPassword" v-model="confirmPassword"/>
      <!-- <FormInput type="select" labelholder="auth.gender" v-model="user.gender" :itemsMap="userGenders"/> -->
      <button class="btn big primary" :disabled="!isUserValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
import { accountService } from '@/apps/megaphonApp/modules/account/services/account.service';
export default {
  name: 'SignupPage',
  data() {
    return {
      user: accountService.getEmptyAccount(),
      confirmPassword: '',
    }
  },
  computed: {
    isUserValid() {
      const { user } = this;
      return user.password && (user.password === this.confirmPassword) && user.firstName && user.lastName && user.email;
    },
    rootOrg() {
      return this.$store.getters.rootOrg;
    }
    // userGenders() {
    //   return this.$store.getters['settings/config'].userGenders;
    // }
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
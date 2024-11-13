<template>
  <div class="auth-page signup-page flex column gap20 align-center justify-center width-all">
    <router-link class="btn width-content" :to="{ name: 'LoginPage', query: { endpoint: $route.query.endpoint } }">{{$t('login')}}</router-link>
    <form @submit.prevent="signup" class="simple-form">
      <img v-if="!rootOrg" class="logo" :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      <h4>{{$t('signup')}}</h4>
      <!-- <FormInput type="text" labelholder="auth.username" v-model="user.username"/> -->
      <FormInput type="text" labelholder="auth.firstname" v-model="user.firstName"/>
      <FormInput type="text" labelholder="auth.lastname" v-model="user.lastName"/>
      <FormInput type="text" labelholder="auth.email" v-model="user.email"/>
      <FormInput type="phone-number" labelholder="account.mobile" v-model="user.mobileData" @change="val => user.mobile = val.formatted"/>
      <FormInput type="text" labelholder="auth.password" v-model="user.password" :error="isPassValid ? '' : $t('auth.passValidationExplenation')" :tooltipMsg="$t('auth.passValidationExplenation')"/>
      <FormInput type="text" labelholder="auth.confirmPassword" v-model="confirmPassword"/>
      <!-- <FormInput type="select" labelholder="auth.gender" v-model="user.gender" :itemsMap="userGenders"/> -->
      <button class="btn big primary" :disabled="!isUserValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import { accountService } from '@/apps/megaphonApp/modules/account/services/account.service';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import { validatePassword } from '../../common/services/util.service';

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
      
      return user.password && this.isPassValid && (user.password === this.confirmPassword) && user.firstName && user.lastName && user.email && user.mobile;
    },
    rootOrg() {
      return this.$store.getters.rootOrg;
    },
    isPassValid() {
      return validatePassword(this.user.password);
    }
    // userGenders() {
    //   return this.$store.getters['settings/config'].userGenders;
    // }
  },
  methods: {
    async signup() {
      if (!this.isUserValid) return;
      const res = await this.$store.dispatch({ type: 'auth/signup', cred: this.user });
      if (res.needs2FactorAuth) {
        // this.showFinishAuthModal = true;
        evEmmiter.emit('needs_2_factor_auth', '/', res.comunicationMethods);
      }
      else this.$router.push(this.$route.query.endpoint || this.$store.getters['auth/redirectPage'] || '/');
    }
  },
  components: {
    FormInput
  }
}
</script>
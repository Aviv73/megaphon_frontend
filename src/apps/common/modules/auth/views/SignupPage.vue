<template>
  <div class="auth-page signup-page flex column gap20 align-center justify-center width-all">
    <router-link :to="{ name: 'LoginPage', query: { endpoint: $route.query.endpoint } }"><button class="btn width-content">{{$t('login')}}</button></router-link>
    <form @submit.prevent="signup" class="simple-form">
      <!-- <img v-if="!rootOrg" class="logo" :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon"> -->
      <h4>{{$t('signup')}}</h4>
      <!-- <FormInput type="text" labelholder="authLocales.username" v-model="user.username"/> -->
      <FormInput type="text" labelholder="authLocales.firstname" v-model="user.firstName"/>
      <FormInput type="text" labelholder="authLocales.lastname" v-model="user.lastName"/>
      <FormInput type="text" labelholder="authLocales.email" v-model="user.email"/>
      <FormInput type="phone-number" labelholder="authLocales.mobile" v-model="user.mobileData" @change="val => user.mobile = val.formatted"/>
      <FormInput type="text" labelholder="authLocales.password" v-model="user.password" :error="isPassValid ? '' : $t('authLocales.passValidationExplenation')" :tooltipMsg="$t('authLocales.passValidationExplenation')"/>
      <FormInput type="text" labelholder="authLocales.confirmPassword" v-model="confirmPassword"/>
      <!-- <FormInput type="select" labelholder="authLocales.gender" v-model="user.gender" :itemsMap="userGenders"/> -->
      <button class="btn big primary" :disabled="!isUserValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import { accountService } from '@/apps/megaphonApp/modules/account/services/account.service';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import { Utils } from '../../common/services/util.service';

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
      return Utils.validatePassword(this.user.password);
    }
    // userGenders() {
    //   return this.$store.getters['settings/config'].userGenders;
    // }
  },
  methods: {
    async signup() {
      if (!this.isUserValid) return;
      const res = await this.$store.dispatch({ type: 'auth/signup', cred: this.user, organizationId: this.rootOrg?._id });
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
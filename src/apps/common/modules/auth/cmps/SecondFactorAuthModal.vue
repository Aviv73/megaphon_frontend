<template>
  <Modal v-if="showModal" class="second-factor-auth-modal">
    <div class="flex column align-start gap20">
      <p>{{$t('auth.required2FactorAthMsg')}}</p>
      <FormInput class="method-input" label="auth.secondFactorMethodMsg" type="radio" v-model="method" :items="comunicationMethods"/>
      <button @click="generatePass" class="btn big">{{$t(didSend ? 'sendAgain' : 'send')}}</button>
      <div v-if="didSend" class="flex align-center width-all space-between">
        <FormInput placeholder="auth.password" type="text" v-model="pass"/>
        <button @click="finishAuth" :disabled="!method" class="btn big">{{$t('login')}}</button>
      </div>
      <MiniLoader v-if="isLoading"/>
      <p v-else>{{$t('auth.secFactorPassExpirationMsg')}}</p>
    </div>
  </Modal>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue'
import Modal from '../../common/cmps/Modal.vue'
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import MiniLoader from '../../common/cmps/MiniLoader.vue';
export default {
  name: 'SecondFactorAuthModal',
  components: { Modal, FormInput, MiniLoader },
  data() {
    return {
      pass: '',
      method: '',
      showModal: false,
      didSend: false,
      redirectEndpoint: '',
      requiredComunicationMethods: []
    }
  },

  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    isLoading() {
      return this.$store.getters['auth/isLoading'];
    },

    comunicationMethods() {
      if (this.requiredComunicationMethods?.length) return this.requiredComunicationMethods;
      const methods = [];
      // if (this.loggedUser?.email) methods.push('email');
      if (this.loggedUser?.mobile) methods.push('sms');
      return methods;
    }
  },

  methods: {
    async generatePass() {
      this.didSend = false;
      await this.$store.dispatch({ type: 'auth/makeSecondFactorAuthPass', method: this.method });
      this.didSend = true;
    },
    async finishAuth() {
      await this.$store.dispatch({ type: 'auth/finish2FactorAuth', pass: this.pass, method: this.method });
      if (this.$route.query.endpoint) this.$router.push(this.$route.query.endpoint);
      else if (this.redirectEndpoint) this.$router.push(this.redirectEndpoint);
      else window.location.reload();
      this.showModal = false;
      this.redirectEndpoint = '';
      this.requiredComunicationMethods = [];
    }
  },

  created() {
    const on2AuthCb = async (endpoint, requiredComunicationMethods) => {
      if (this.showModal) return;
      this.showModal = true;
      if (endpoint) this.redirectEndpoint = endpoint;
      // else this.redirectEndpoint = this.$route.query.endpoint;
      if (requiredComunicationMethods) this.requiredComunicationMethods = requiredComunicationMethods;
      this.pass = '';
      this.didSend = false;
      // evEmmiter.off('needs_2_factor_auth', on2AuthCb);
      // try {
      //   if (this.loggedUser) await this.$store.dispatch({ type: 'auth/makeSecondFactorAuthPass' });
      //   const pass = await alertService.Prompt(this.$t('auth.required2FactorAthMsg'), this.$t('auth.password'));
      //   await this.$store.dispatch({ type: 'auth/finishAuth', pass });
      //   if (endpoint) this.$router.push(endpoint);
      //   evEmmiter.on('needs_2_factor_auth', on2AuthCb);
      // } catch(err) {
      //   if (err.needs2FactorAuth) on2AuthCb();
      //   // else evEmmiter.on('needs_2_factor_auth', on2AuthCb);
      // }
      // finally {
      //   evEmmiter.on('needs_2_factor_auth', on2AuthCb);
      // }
    }
    evEmmiter.on('needs_2_factor_auth', on2AuthCb);
  },
  watch: {
    comunicationMethods() {
      this.method = this.comunicationMethods[0];
    }
  }

}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.second-factor-auth-modal {
  .modal {
    width: em(400px);
  }
  .method-input {
    flex-direction: column;
    align-items: flex-start;
    gap: em(15px);
  }
}
</style>
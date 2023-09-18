<template>
  <div class="account-edit simple-form app-form-styling flex column gap20">
    <h2>{{$t('account.editAccount')}}</h2>
    <form v-if="accountToEdit" @submit.prevent="saveAccount" class="flex column align-start gap10">
      <FormInput type="text" labelholder="account.firstname" v-model="accountToEdit.firstname"/>
      <FormInput type="text" labelholder="account.lastname" v-model="accountToEdit.lastname"/>
      <FormInput type="text" labelholder="account.username" v-model="accountToEdit.username"/>
      <FormInput type="text" labelholder="account.email" v-model="accountToEdit.email"/>
      <FormInput type="select" labelholder="account.gender" v-model="accountToEdit.gender" :itemsMap="userGenders"/>
      <FormInput type="text" labelholder="account.newPassword" v-model="accountToEdit.password"/>
      <FormInput type="text" labelholder="account.confirmPassword" v-model="confirmPassword"/>
      <!-- <FormInput type="text" placeholder="role" v-model="accountToEdit.roles[0]"/> -->
      <button class="btn primary" :disabled="!isAccountValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue'
export default {
  name: 'AccountEdit',
  data() {
    return {
      accountToEdit: null,
      confirmPassword: ''
    }
  },
  computed: {
    isAccountValid() {
      const user = this.accountToEdit;
      return user && user.username && user.firstname && user.lastname && user.email &&
             (user.password? this.confirmPassword === user.password : true);
    },
    userGenders() {
      return this.$store.getters['settings/config'].userGenders;
    }
  },
  methods: {
    async getAccount() {
      this.accountToEdit = await this.$store.dispatch({ type: 'account/loadAccount', id: this.$route.params.id });
    },
    async saveAccount() {
      if (!this.isAccountValid) return;
      await this.$store.dispatch({ type: 'account/saveAccount', account: this.accountToEdit });
      this.$router.push({ name: 'HomePage' })
    }
  },
  created() {
    this.getAccount();
  },
  watch: {
    '$route.params.id'() {
      this.getAccount();
    }
  },
  components: {
    FormInput
  }
}
</script>
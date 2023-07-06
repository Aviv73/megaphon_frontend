<template>
  <div class="account-edit simple-form flex column gap40">
    <h2>{{$t('account.editAccount')}}</h2>
    <form v-if="accountToEdit" @submit.prevent="saveAccount" class="flex column align-start gap20">
      <FormInput type="text" labelholder="account.firstname" v-model="accountToEdit.firstName"/>
      <FormInput type="text" labelholder="account.lastname" v-model="accountToEdit.lastName"/>
      <FormInput type="text" labelholder="account.email" v-model="accountToEdit.email"/>
      <FormInput type="text" labelholder="account.newPassword" v-model="accountToEdit.password"/>
      <FormInput type="text" labelholder="account.confirmPassword" v-model="confirmPassword"/>
      <FormInput type="multiselect" placeholder="role" v-model="accountToEdit.roles" :items="roles"/>
    </form>
    <button class="btn big primary" @click="saveAccount" :disabled="!isAccountValid">{{$t('submit')}}</button>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
export default {
  name: 'AccountEdit',
  data() {
    return {
      accountToEdit: null,
      confirmPassword: '',
      roles: ['user', 'producer', 'admin']
    }
  },
  computed: {
    isAccountValid() {
      const user = this.accountToEdit;
      return user && user.firstName && user.lastName && user.email &&
             (user.password? this.confirmPassword === user.password : true);
    },
  },
  methods: {
    async getAccount() {
      this.accountToEdit = await this.$store.dispatch({ type: 'account/loadItem', id: this.$route.params.id });
    },
    async saveAccount() {
      if (!this.isAccountValid) return;
      await this.$store.dispatch({ type: 'account/saveItem', item: this.accountToEdit });
      this.close();
    },
    close() {
      this.$router.push({ name: 'AccountPage', params: { organizationId: this.$route.params.organizationId } })
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
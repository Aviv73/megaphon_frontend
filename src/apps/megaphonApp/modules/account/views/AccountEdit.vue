<template>
  <div v-if="accountToEdit" class="account-edit app-form-styling simple-form flex column gap40">
    <h2 v-if="accountToEdit._id">{{$t('account.editAccount')}}</h2>
    <h2 v-else>{{$t('account.createAccount')}}</h2>
    <form v-if="accountToEdit" @submit.prevent="saveAccount" class="flex column gap20">
      <FormInput type="text" labelholder="account.firstname" v-model="accountToEdit.firstName"/>
      <FormInput type="text" labelholder="account.lastname" v-model="accountToEdit.lastName"/>
      <FormInput type="text" labelholder="account.email" v-model="accountToEdit.email"/>
      <FormInput type="text" labelholder="account.newPassword" v-model="accountToEdit.password"/>
      <FormInput type="text" labelholder="account.confirmPassword" v-model="confirmPassword"/>

      <template v-if="isUserAdmin && !isNested">
        <FormInput type="multiselect" labelholder="roles" v-model="accountToEdit.roles" :items="systemRoles"/>
        <div class="organizations flex column gap5">
          <div v-for="org in orgsToShow" :key="org._id" class="flex align-center space-between gap5">
            <div class="flex align-center gap5">
              <FormInput type="checkbox" :value="isInOrg(org.organizationId)" @change="toggleOrg(org.organizationId)"/>
              <p>{{getOrgName(org.organizationId)}}</p>
            </div>
            <FormInput type="multiselect" placeholder="role" :value="org.roles || []" @change="val => updateOrgRoles(org.organizationId, val)" :items="systemRoles"/>
          </div>
        </div>
      </template>
    </form>
    <div class="flex align-center space-between gap20">
      <button class="btn big primary" @click="saveAccount" :disabled="!isAccountValid">{{$t('submit')}}</button>
      <button class="btn big" @click="close" v-if="!isNested">{{$t('close')}}</button>
    </div>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import consts from '@/apps/common/modules/common/services/const.service.js';
export default {
  name: 'AccountEdit',
  props: {
    isNested: [Boolean]
  },
  data() {
    return {
      accountToEdit: null,
      confirmPassword: '',
      // systemRoles: ['user', 'producer', 'admin'],
      systemRoles: [...Object.values(consts.userRoles)],
      // allOrgs: []
    }
  },
  computed: {
    isAccountValid() {
      const user = this.accountToEdit;
      return user && user.firstName && user.lastName && user.email &&
            (
              user._id?
                (user.password? this.confirmPassword === user.password : true) :
                (user.password && (this.confirmPassword === user.password))
            )
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    orgs() {
      return this.$store.getters['organization/items'];
    },
    orgsToShow() {
      const orgs = this.loggedUser?.organizations.filter(org => this.orgs.find(c => c._id === org.organizationId)) || [];
      return orgs.map(org => this.accountToEdit.organizations.find(c => c.organizationId === org.organizationId) || { organizationId: org.organizationId, roles: [] });
    },

    isUserAdmin() {
      return this.$store.getters['auth/isAdmin'];
    },

    isLoggedUser() {
      if (!this.loggedUser) return false;
      return this.accountToEdit?._id === this.loggedUser._id;
    }
  },
  methods: {
    async getAccount() {
      this.accountToEdit = await this.$store.dispatch({ type: 'account/loadItem', id: this.$route.params.id });
    },
    async saveAccount() {
      if (!this.isAccountValid) return;
      await this.$store.dispatch({ type: 'account/saveItem', item: this.accountToEdit });
      if (this.isLoggedUser) this.$store.dispatch('auth/getUserInfo');
      this.close();
    },
    close() {
      if (this.isNested) return;
      this.$router.push({ name: 'AccountPage', params: { organizationId: this.$route.params.organizationId } })
    },

    getOrgName(orgId) {
      return this.orgs.find(c => c._id === orgId)?.name || '';
    },
    isInOrg(orgId) {
      return !!this.accountToEdit.organizations.find(c => c.organizationId === orgId);
    },
    toggleOrg(orgId) {
      const idx = this.accountToEdit.organizations.findIndex(c => c.organizationId === orgId);
      if (idx !== -1) this.accountToEdit.organizations.splice(idx, 1);
      else {
        this.accountToEdit.organizations.push({
          organizationId: orgId,
          roles: []
        })
      }
    },
    updateOrgRoles(orgId, roles) {
      const org = this.accountToEdit.organizations.find(c => c.organizationId === orgId);
      if (!org) return;
      org.roles = roles;
    }
    // async getAllOrgs() {
      // this.allOrgs = await this.$store.dispatch({ type: 'organization/getAllItems' });
    // }
  },
  created() {
    this.getAccount();
    // this.getAllOrgs();
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
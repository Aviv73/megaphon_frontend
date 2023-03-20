<template>
  <div v-if="organization" class="organization-edit flex column gap30">
    <h2>{{$t($route.params.id? 'organization.editOrganization' : 'organization.createOrganization')}}</h2>
    <form v-if="organization" @submit.prevent="saveOrganization" class="simple-form gap50">
      <FormInput type="text" labelholder="name" v-model="organization.name"/>
      <FormInput type="textarea" labelholder="description" v-model="organization.desc"/>
      <button class="btn big primary" :disabled="!isOrganizationValid">{{$t('save')}}</button>
    </form>
    <div v-if="organization._id" class="flex column gap10">
      <h3>{{$t('organization.inviteMembers')}}</h3>
      <SearchInput class="width-content" v-model="searchAccountStr" @change="getAccounts"/>
      <ul v-if="accounts.length" class="flex column gap5">
        <li v-for="account in accounts" :key="account._id" class="user-preview">
            <MiniAccountPreview :account="account"/>
            <button class="btn secondary height-all" @click.prevent="() => inviteAccount(account)">{{$t('invite')}}</button> 
            <!-- <FormInput @keydown.native.enter.prevent.stop="" type="select" v-model="rolesToInvite[account._id]" :itemsMap="orgRoles"/> -->
        </li>
      </ul>
      <p v-else-if="!searchPristin">{{$t('noMatches')}}...</p>
    </div>
    <div class="flex column gap10">
      <h3>{{$t('organization.members')}}:</h3>
      <li v-for="account in organization.members" :key="account._id" class="flex align-center gap10">
        <div class="user-preview">
          <MiniAccountPreview :account="account"/>
          <FormInput :disabled="account._id === loggedUser?._id" @keydown.native.enter.prevent.stop="" type="select" @input="role => updateUserRole(account, role)" :value="account.roles[0]" :itemsMap="orgRoles"/>
        </div>
        <button class="btn small" v-if="!account.roles.includes('admin')" @click="removeAccountFromOrg(account)">X</button> 
      </li>
    </div>
  </div>
</template>

<script>
import MiniAccountPreview from '../../account/cmps/MiniAccountPreview.vue'
import FormInput from '../../common/cmps/FormInput.vue'
import SearchInput from '../../common/cmps/SearchInput.vue'
import { alertService } from '../../common/services/alert.service'
export default {
  name: 'OrganizationEdit',
  data() {
    return {
      organization: null,
      searchAccountStr: '',
      searchPristin: true,
      rolesToInvite: {}
    }
  },
  computed: {
    isOrganizationValid() {
      return this.organization && this.organization.name;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    accounts() {
      // return this.$store.getters['account/items'].filter(c => c._id !== this.loggedUser?._id);
      return this.$store.getters['account/items'].filter(c => !this.organization.members.find(_ => _._id === c._id));
    },
    orgRoles() {
        const roles = {
          ...this.$store.getters['settings/config'].organizationRoles
        }
        delete roles.creator
        return roles;
    }
  },
  methods: {
    async getOrganization() {
      this.organization = await this.$store.dispatch({ type: 'organization/loadOrganization', id: this.$route.params.id });
    },
    async getAccounts() {
      if (!this.searchAccountStr) return;
      this.searchPristin = false;
      await this.$store.dispatch({ type: 'account/loadAccounts', filterBy: { filter: { search: this.searchAccountStr } } });
      this.rolesToInvite = this.accounts.reduce((acc, c) => {
        acc[c._id] = this.rolesToInvite[c._id] || 'user';
        return acc;
      }, {});
    },
    async saveOrganization() {
      if (!this.isOrganizationValid) return;
      await this.$store.dispatch({ type: 'organization/saveOrganization', organization: this.organization });
      this.$router.push({ name: 'OrganizationPage' });
    },
    async inviteAccount(account) {
      const accountId = account._id
      await this.$store.dispatch({ type: 'organization/inviteAccount', organizationId: this.$route.params.id, accountId, role: this.rolesToInvite[accountId] });
      this.organization.members.push({
        ...account,
        roles: [this.rolesToInvite[accountId]]
      });
    },
    async updateUserRole(account, role) {
      const roles = [role];
      if (account.roles.includes('creator')) roles.push('creator')
      await this.$store.dispatch({ type: 'organization/updateAccountRole', organizationId: this.$route.params.id, accountId: account._id, roles });
    },
    async removeAccountFromOrg(account) {
      if (!await alertService.Confirm(this.$t('organization.alerts.confirmRemoveAccount'))) return;
      const accountId = account._id
      await this.$store.dispatch({ type: 'organization/removeAccount', organizationId: this.$route.params.id, accountId });
      const idx = this.organization.members.findIndex(c => c._id === accountId);
      if (idx !== -1) this.organization.members.splice(idx, 1);
    }
  },
  created() {
    this.getOrganization();
    // this.getAccounts();
  },
  watch: {
    '$route.params.id'() {
      this.getOrganization();
      // this.getAccounts();
    }
  },
  components: {
    FormInput,
    MiniAccountPreview,
    SearchInput
  }
}
</script>

<style lang="scss">
.organization-edit {
  .user-preview {
    width: 170px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .form-input {
      width: unset;
    }
  }
}
</style>
<template>
  <div v-if="accountToEdit" class="account-edit app-form-styling simple-form flex column gap40">
    <h2 v-if="accountToEdit._id">{{$t('account.editAccount')}}</h2>
    <h2 v-else>{{$t('account.createAccount')}}</h2>
    <form v-if="accountToEdit" @submit.prevent="saveAccount" class="flex column gap20">
      <FormInput type="text" labelholder="account.firstname" v-model="accountToEdit.firstName"/>
      <FormInput type="text" labelholder="account.lastname" v-model="accountToEdit.lastName"/>
      <FormInput type="text" labelholder="account.email" v-model="accountToEdit.email"/>
      <FormInput type="phone-number" labelholder="account.mobile" v-model="accountToEdit.mobile"/>
      <FormInput type="text" labelholder="account.newPassword" v-model="accountToEdit.password"/>
      <FormInput type="text" labelholder="account.confirmPassword" v-model="confirmPassword"/>

      <div class="flex column gap5 mailing-section">
        <h4>{{$t('account.newsletter')}}</h4>
        <FormInput type="checkbox" labelholder="account.mailing.whatsapp" v-model="accountToEdit.mailing.whatsApp"/>
        <FormInput type="checkbox" labelholder="account.mailing.newsletter" v-model="accountToEdit.mailing.newsletter"/>
        <FormInput type="checkbox" labelholder="account.mailing.unsubscribeMsg" v-model="accountToEdit.mailing.unsubscribed"/>
      </div>

      <template v-if="isUserAdmin && !isNested">
        <FormInput type="multiselect" labelholder="roles" v-model="accountToEdit.roles" :items="systemRoles"/>
        <div class="organizations flex column gap5">
          <div v-for="org in orgsToShow" :key="org._id" class="flex align-center space-between gap5">
            <div class="flex align-center gap5">
              <FormInput type="checkbox" :value="isInOrg(org._id)" @change="toggleOrg(org._id)"/>
              <p>{{getOrgName(org._id)}}</p>
            </div>
            <FormInput type="multiselect" placeholder="role" :value="org.roles || []" @change="val => updateOrgRoles(org._id, val)" :items="orgRoles"/>
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
import { consts } from '@/apps/common/modules/common/services/const.service.js';
import { organizationService } from '../../organization/services/organization.service';
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
      // allOrgs: []
    }
  },
  computed: {
    systemRoles: () => [...Object.values(consts.userRoles)].map(c => ({ value: c, label: `organization.orgRoles.${c}` })),
    orgRoles: () => [...Object.values(consts.organizationRoles)].slice(1).map(c => ({ value: c, label: `organization.orgRoles.${c}` })),
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
      const orgs = this.loggedUser?.organizations.filter(org => this.orgs.find(c => c._id === org._id)) || [];
      return orgs.map(org => this.accountToEdit.organizations.find(c => c._id === org._id) || { _id: org._id, roles: [] });
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
      return !!this.accountToEdit.organizations.find(c => c._id === orgId);
    },
    toggleOrg(orgId) {
      const idx = this.accountToEdit.organizations.findIndex(c => c._id === orgId);
      if (idx !== -1) this.accountToEdit.organizations.splice(idx, 1);
      else {
        const orgItem = organizationService.getAccountOrgItem(orgId, this.loggedUser._id);
        this.accountToEdit.organizations.push(orgItem);
      }
    },
    updateOrgRoles(orgId, roles) {
      const org = this.accountToEdit.organizations.find(c => c._id === orgId);
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

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .account-edit {
    padding: em(10px) 0;
    .mailing-section {
      .form-input-checkbox {
        flex-direction: row-reverse;
        justify-content: flex-end;
        align-items: flex-start;
        .label {
          flex: 1;
        }
        .input {
          width: fit-content;
          flex: unset;
        }
      }
    }
  }
}
</style>
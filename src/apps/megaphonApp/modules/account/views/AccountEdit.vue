<template>
  <fieldset v-if="accountToEdit" class="account-edit app-form-styling simple-form flex column gap40" :disabled="isDisabled">
    <h2 v-if="accountToEdit._id">{{$t('accountLocales.editAccount')}}</h2>
    <h2 v-else>{{$t('accountLocales.createAccount')}}</h2>
    <form v-if="accountToEdit" @submit.prevent="saveAccount" class="flex column gap20">
      <FormInput :required="true" type="text" labelholder="accountLocales.firstname" v-model="accountToEdit.firstName"/>
      <FormInput :required="true" type="text" labelholder="accountLocales.lastname" v-model="accountToEdit.lastName"/>
      <FormInput :required="true" type="text" labelholder="accountLocales.email" v-model="accountToEdit.email"/>
      <FormInput :required="true" type="phone-number" labelholder="accountLocales.mobile" v-model="accountToEdit.mobileData" @change="val => accountToEdit.mobile = val.formatted"/>
      <FormInput :required="true" type="text" labelholder="accountLocales.newPassword" v-model="accountToEdit.password" :error="isPassValid ? '' : $t('authLocales.passValidationExplenation')" :tooltipMsg="$t('authLocales.passValidationExplenation')"/>
      <FormInput :required="true" type="text" labelholder="accountLocales.confirmPassword" v-model="confirmPassword"/>

      <!-- <div class="flex column gap5 mailing-section">
        <h4>{{$t('accountLocales.newsletter')}}</h4>
        <FormInput type="checkbox" labelholder="accountLocales.mailing.sms" v-model="accountToEdit.mailing.sms"/>
        <FormInput type="checkbox" labelholder="accountLocales.mailing.newsletter" v-model="accountToEdit.mailing.newsletter"/>
        <FormInput type="checkbox" labelholder="accountLocales.mailing.unsubscribeMsg" v-model="accountToEdit.mailing.unsubscribed"/>
      </div> -->

      <!-- <template v-if="isUserAdmin && !isNested"> -->
      <template v-if="!isNested">
        <FormInput v-if="isUserAdmin" type="multiselect" labelholder="roles" v-model="accountToEdit.roles" :items="systemRoles"/>
        <div v-if="isUserCurrOrgAdmin || isUserAdmin" class="organizations flex column gap5">
          <div v-for="org in orgsToShow" :key="org._id" class="flex align-center space-between gap5">
            <div class="flex align-center gap5">
              <FormInput type="checkbox" :value="isInOrg(org._id)" @change="toggleOrg(org._id)"/>
              <p>{{getOrgName(org._id)}}</p>
            </div>
            <div class="flex align-center gap10">
              <FormInput type="checkbox" :label="$t('accountLocales.skipSecondFactorAuth')" :value="org?.skipSecondFactorAuth || false" @change="val => updateOrgProp(org._id, 'skipSecondFactorAuth', val)"/>
              <FormInput type="multiselect" placeholder="role" :value="org?.roles || []" @change="val => updateOrgProp(org._id, 'roles', val)" :items="orgRoles"/>
            </div>
          </div>
        </div>
      </template>
    </form>
    <div class="flex align-center space-between gap20">
      <div class="flex gap20">
        <button class="btn big primary" @click="saveAccount" :disabled="!isAccountValid">{{$t('save')}}</button>
        <button class="btn big" @click="close" v-if="!isNested">{{$t('close')}}</button>
      </div>
      <button class="btn big" @click="deleteAccount" v-if="accountToEdit._id">{{$t('delete')}}</button>
    </div>
  </fieldset>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import { consts } from '@/apps/common/modules/common/services/const.service.js';
import { organizationService } from '../../organization/services/organization.service';
import { validatePassword } from '@/apps/common/modules/common/services/util.service';
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
    systemRoles: () => [...Object.values(consts.userRoles)].map(c => ({ value: c, label: `organizationLocales.orgRoles.${c}` })),
    orgRoles: () => [...Object.values(consts.organizationRoles)].slice(1).map(c => ({ value: c, label: `organizationLocales.orgRoles.${c}` })),
    isAccountValid() {
      const user = this.accountToEdit;
      return user && user.firstName && user.lastName && user.email &&
            (
              user._id?
                (user.password? this.confirmPassword === user.password : true) :
                (user.password && (this.confirmPassword === user.password) && this.isPassValid)
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
    isUserCurrOrgAdmin() {
      return organizationService.isUserAdmin(this.organizationId, this.loggedUser);
    },
    isWatchOnly() {
      return this.$store.getters['auth/isWatchOnly'];
    },

    isLoggedUser() {
      if (!this.loggedUser) return false;
      return this.accountToEdit?._id === this.loggedUser._id;
    },
    
    isPassValid() {
      return validatePassword(this.accountToEdit.password);
    },

    organizationId() {
      const orgId = this.$route.params.organizationId;
      return (orgId == '-1') ? '' : orgId;
    },
    isDisabled() {
      if (!this.isUserAdmin && this.accountToEdit?.roles?.includes(consts.userRoles.admin)) return true;
      return false;
    },
  },
  methods: {
    async getAccount() {
      this.accountToEdit = await this.$store.dispatch({ type: 'account/loadItem', id: this.$route.params.id });
      if (this.organizationId && !this.accountToEdit._id) {
        this.toggleOrg(this.organizationId);
      }
    },
    async saveAccount() {
      if (!this.isAccountValid) return;
      await this.$store.dispatch({ type: 'account/saveItem', item: this.accountToEdit, organizationId: this.organizationId || undefined });
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
    updateOrgProp(orgId, propName, roles) {
      const org = this.accountToEdit.organizations.find(c => c._id === orgId);
      if (!org) return;
      org[propName] = roles;
    },
    async deleteAccount() {
      const orgId = this.$route.params.organizationId == '-1' ? '' : this.$route.params.organizationId;
      await this.$store.dispatch({ type: 'account/removeItem', id: this.$route.params.id, organizationId: orgId });
      this.close();
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
    .form-input-checkbox {
      // flex-direction: row-reverse;
    }
    .mailing-section {
      .form-input-checkbox {
        // flex-direction: row-reverse;
        // justify-content: flex-end;
        // align-items: flex-start;
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
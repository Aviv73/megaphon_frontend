<template>
  <ToggleModal :showCloseBtn="true" :fullScreen="true" class="invite-account-modal">
    <template #toggler>
        <div class="btn big">
          {{$t('account.inviteAccounts')}}
        </div>
      </template>
      <template #content>
        <div class="flex column gap10">
          <div class="flex align-center space-between gap10">
            <h3>{{$t('organization.inviteMembers')}}</h3>
            <router-link :to="{ name: 'AccountEdit', params: { organizationId: organizationId } }"><button class="btn primary mid">{{$t('addNew')}}</button></router-link>
          </div>
          <SearchInput class="width-content" v-model="searchAccountStr" @change="getAccounts"/>
          <ul v-if="accounts.length" class="flex column gap5">
            <li v-for="account in accounts" :key="account._id" class="user-preview flex align-center space-between">
                <MiniAccountPreview :account="account"/>
                <button class="btn height-all" @click.prevent="() => inviteAccount(account)">{{$t('invite')}}</button> 
                <!-- <FormInput @keydown.native.enter.prevent.stop="" type="select" v-model="rolesToInvite[account._id]" :itemsMap="orgRoles"/> -->
            </li>
          </ul>
          <p v-else-if="!searchPristin">{{$t('noMatches')}}...</p>
        </div>
      </template>
  </ToggleModal>
</template>

<script>
import SearchInput from '../../../../common/modules/common/cmps/SearchInput.vue';
import ToggleModal from '../../../../common/modules/common/cmps/ToggleModal.vue';
import MiniAccountPreview from '../../account/cmps/MiniAccountPreview.vue';
import { consts } from '@/apps/common/modules/common/services/const.service.js';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
export default {
  name: 'InviteAccountModal',
  components: { ToggleModal, SearchInput, MiniAccountPreview, FormInput },
  data() {
    return {
      searchAccountStr: '',
      searchPristin: true,
      accounts: [],
      rolesToInvite: {},
      orgToShow: {},
      // orgRoles: {...consts.organizationRoles}
    }
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    orgMembers() {
      return this.orgToShow?.members || [];
    }
  },
  methods: {
    async getAccounts() {
      if (!this.searchAccountStr) return;
      this.searchPristin = false;
      this.accounts = await this.$store.dispatch({ type: 'account/loadItems', dontSet: true, filterBy: { filter: { search: this.searchAccountStr } } });
      this.accounts = this.accounts.items.filter(c => !this.orgMembers.find(_ => _._id === c._id));
      this.rolesToInvite = this.accounts.reduce((acc, c) => {
        acc[c._id] = this.rolesToInvite[c._id] || consts.organizationRoles.client;
        return acc;
      }, {});
    },
    async inviteAccount(account) {
      const accountId = account._id
      await this.$store.dispatch({ type: 'organization/inviteAccount', organizationId: this.organizationId, accountId, role: this.rolesToInvite[accountId], status: 'approved' });
      this.orgToShow.members.push({
        ...account,
        roles: [this.rolesToInvite[accountId]]
      });
    }
  },
  async created() {
    this.orgToShow = await this.$store.dispatch({ type: 'organization/loadItem', id: this.organizationId, dontSet: true, isToAddMembersData: true });
  }
}
</script>

<style lang="scss">
.invite-account-modal {

}
</style>
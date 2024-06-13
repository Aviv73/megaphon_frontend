<template>
  <div class="flex column align-start gap40 align-center_">
    <h2>{{$t('organization.searchOrganizations')}}</h2>
    <div class="join-org-page flex column gap50">
      <SearchInput class="width-content" v-model="searchOrgStr" @change="getOrgs"/>
      <ul v-if="searchedOrgs.length" class="flex column gap30">
        <li v-for="org in searchedOrgs" :key="org._id" class="org-preview flex gap20">
            <!-- <MiniAccountPreview :org="org"/> -->
            <img :src="org.logoUrl"/>
            <div class="flex-1 flex align-center justify-center">
              <h3>{{org.name}}</h3>
            </div>
            <div class="flex align-center justify-center">
              <button v-if="!isInOrg(org)" class="btn" @click.prevent="() => joinOrg(org)">{{$t('join')}}</button>
              <span v-else>{{getOrgStatus(org) || $t('joined')}}</span>
            </div>
            <!-- <FormInput @keydown.native.enter.prevent.stop="" type="select" v-model="rolesToInvite[org._id]" :itemsMap="orgRoles"/> -->
        </li>
      </ul>
      <p v-else-if="!searchPristin">{{$t('noMatches')}}...</p>
    </div>
  </div>
</template>

<script>
import SearchInput from '../../../../common/modules/common/cmps/SearchInput.vue';
import { organizationService } from '../services/organization.service';
export default {
  components: { SearchInput },
  nme: 'JoinOrgPage',
  data() {
    return {
      searchOrgStr: '',
      searchedOrgs: [],
      searchPristin: true,
    }
  },
  
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  methods: {
    getOrgStatus(org) {
      const orgInAccoount = organizationService.getOrgItemInAccount(this.loggedUser, org._id);
      return orgInAccoount?.status;
    },
    isInOrg(org) {
      return organizationService.isUserInOrg(org._id, this.loggedUser);
    },
    async getOrgs() {
      if (!this.searchOrgStr) return;
      this.searchPristin = false;
      this.searchedOrgs = await this.$store.dispatch({ type: 'organization/searchOrganizations', filterBy: { filter: { search: this.searchOrgStr } } });
      // this.searchedOrgs = this.searchedOrgs.filter(c => !this.isInOrg(c));
    },
    async joinOrg(org) {
      const accountId = this.loggedUser._id;
      await this.$store.dispatch({ type: 'organization/inviteAccount', organizationId: org._id, accountId, successMsg: 'organization.alerts.requestSentSuccess' });
      this.$store.dispatch('auth/getUserInfo');
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.join-org-page {
  .org-preview {
    background-color: #fff;
    border-end-start-radius: em(30px);
    border-start-start-radius: em(30px);
    padding-inline-end: em(20px);
    overflow: hidden;
    >*:not(:last-child) {
      border-inline-end: 1px solid rgba(128, 128, 128, 0.2);
      // padding-inline-end: em(20px);
    }
    >:nth-child(2) {
      padding-inline-end: em(20px);
    }
    img {
      // background-color: #000;
      object-fit: contain;
      height: 50px;
      width: 50px;
      // border-radius: 50%;
      // border: 2px solid white;
    box-shadow: $light-shadow;
    }
  }
}
</style>
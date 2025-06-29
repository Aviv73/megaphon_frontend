<template>
  <section class="account-page flex column gap10 width-all">
    <h2 class="inner-page-sub-header">{{$t(queryRoleType === 'watchOnly' ? 'accountLocales.mediaAccounts' : 'accountLocales.accounts')}}</h2>
    <ItemSearchList
      class="height-all table-like-list"
      :itemsData="allAccountData"
      :initFilterBy="filterBy"
      @filter="getAllAccounts"
      itemDetailesPageName="AccountDetails"
      newItemPageName="AccountEdit"
      :singlePreviewCmp="AccountPreview"
      :filterByCmp="AccountFilter"
      :showActions="false"
      :dontRoute="true"
      :isLoading="isLoading"
      :showLoader="false"
      layoutMode="flex"
    >
      <template v-slot:listHeader>
        <div class="flex column gap10 align-start">
          <!-- <div class="actions flex gap10 align-center justify-end width-all" v-if="isUserCurrOrgAdmin || isAdmin">
            <template v-if="organizationId === '-1'">
              <router-link :to="{ name: 'AccountEdit', params: { organizationId: organizationId } }"><button class="btn primary mid">{{$t('addNew')}}</button></router-link>
              <button class="btn big" @click="getAllAccounts(filterBy, '')" :to="{name: 'AccountPage'}">{{$t('accountLocales.viewAllAccounts')}}</button>
            </template>
            <InviteAccountModal v-else/>
          </div> -->
          <div class="table-item-preview table-header">
            <p>{{$t('name')}}</p>
            <p class="wide-screen-item">{{$t('email')}}</p>
            <p>{{$t('accountLocales.roles')}}</p>
            <!-- <p>{{$t('accountLocales.isPandingForApproval')}}</p> -->
          </div>
        </div>
      </template>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import AccountPreview from '../cmps/AccountPreview.vue';
import AccountFilter from '../cmps/AccountFilter.vue';
import InviteAccountModal from '../../organization/cmps/InviteAccountModal.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { alertService } from '@/apps/common/modules/common/services/alert.service'
import { organizationService } from '../../organization/services/organization.service';
import { Utils } from '../../../../common/modules/common/services/util.service';

export default {
  name: 'AccountPage',
  data() {
    return {
      AccountPreview,
      AccountFilter
    }
  },
  methods: {
    getAllAccounts(filterBy, orgId) {
      filterBy = {...filterBy};
      filterBy.organizationId = typeof orgId === 'string'? orgId : this.$route.params.organizationId;
      if (filterBy.organizationId == '-1') {
        filterBy.organizationId = undefined;
        Utils.setDeepVal(filterBy, 'filter.params.roles', 'admin');
      } else {
        if (filterBy?.filter?.params?.roles) delete filterBy.filter.params.roles;
      }
      if (this.queryRoleType) {
        // roleType = producerAndAdmin | watchOnly
        filterBy.roleType = this.queryRoleType;
      }
      this.$store.dispatch({ type: 'account/loadItems', filterBy });
    },
    async approveAccount(account, orgId) {
      if (!await alertService.Confirm(this.$t(`organizationLocales.alerts.confirmAccountApproval`))) return;
      await this.$store.dispatch({ type: 'organization/updateAccountStatus', organizationId: orgId, accountId: account._id, newStatus: 'approved' });
      this.getAllAccounts(this.filterBy, this.organizationId);
    },
    onGetAllAccounts(filterBy) {
      this.getAllAccounts(filterBy, '');
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    isAdmin() {
      return this.$store.getters['auth/isAdmin'];
    },
    organizationId() {
      return this.$route.params.organizationId;
    },
    isUserCurrOrgAdmin() {
      return organizationService.isUserAdmin(this.organizationId, this.loggedUser);
    },
    allAccountData() {
      return this.$store.getters['account/data'];
    },
    filterBy() {
      return this.$store.getters['account/filterBy'];
    },
    isLoading() {
      return this.$store.getters['account/isLoading'];
    },
    queryRoleType() {
      return this.$route.query.roleType;
    }
  },
  watch: {
    organizationId() {
      this.$store.commit('account/resetFilter');
      this.getAllAccounts();
    },
    queryRoleType() {
      this.$store.commit('account/resetFilter');
    }
  },
  created() {
    evManager.on('get-all-accounts', this.onGetAllAccounts);
    evManager.on('approveAccount', this.approveAccount);
  },
  destroyed() {
    evManager.off('get-all-accounts', this.onGetAllAccounts);
    evManager.off('approveAccount', this.approveAccount);
  },
  components: { ItemSearchList, Loader, AccountPreview, AccountFilter, InviteAccountModal }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .account-page {
    padding: em(20px) 0;
    height: auto;

    
    .filter-container {
      padding: em(10px);
      background-color: var(--clr-3);
    }

    // background-color: #E0E0E0;
  }
}
</style>
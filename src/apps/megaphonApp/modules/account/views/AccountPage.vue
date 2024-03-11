<template>
  <section class="account-page flex column width-all flex column">
    <!-- <h2>{{$t('release.releases')}}</h2> -->
    <ItemSearchList
      class="height-all table-like-list"
      :itemsData="allAccountData"
      :initFilterBy="filterBy"
      @filter="getAllRAccounts"
      itemDetailesPageName="AccountDetails"
      newItemPageName="AccountEdit"
      :singlePreviewCmp="AccountPreview"
      :filterByCmp="AccountFilter"
      :showActions="true"
      :dontRoute="true"
      :showLoader="false"
    >
      <div class="flex column gap10 align-start">
        <button class="btn big" v-if="isAdmin && (organizationId === '-1')" @click="getAllRAccounts(filterBy, '')" :to="{name: 'AccountPage'}">{{$t('account.viewAllAccounts')}}</button>
        <div class="table-item-preview table-header">
          <p>{{$t('name')}}</p>
          <p>{{$t('email')}}</p>
          <p>{{$t('account.role')}}</p>
        </div>
      </div>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import AccountPreview from '../cmps/AccountPreview.vue';
import AccountFilter from '../cmps/AccountFilter.vue';

export default {
  name: 'AccountPage',
  data() {
    return {
      AccountPreview,
      AccountFilter
    }
  },
  methods: {
    getAllRAccounts(filterBy, orgId) {
      filterBy.organizationId = typeof orgId === 'string'? orgId : this.$route.params.organizationId;
      this.$store.dispatch({ type: 'account/loadItems', filterBy });
    },
  },
  computed: {
    isAdmin() {
      return this.$store.getters['auth/isAdmin'];
    },
    organizationId() {
      return this.$route.params.organizationId;
    },
    allAccountData() {
      return this.$store.getters['account/data'];
    },
    filterBy() {
      return this.$store.getters['account/filterBy'];
    },
    isLoading() {
      return this.$store.getters['account/isLoading'];
    }
  },
  watch: {
    organizationId() {
      this.getAllRAccounts();
    }
  },
  components: { ItemSearchList, Loader, AccountPreview, AccountFilter }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .account-page {
    padding: em(10px);
    height: auto;

    // background-color: #E0E0E0;
  }
}
</style>
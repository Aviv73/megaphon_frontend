<template>
  <section class="account-page height-all width-all flex column gap10">
    <h2>{{$t('account.account')}}</h2>
    <ItemSearchList
      :itemsData="bugData"
      :initFilterBy="filterBy"
      @filter="getAccounts"
      itemDetailesPageName="AccountDetails"
      newItemPageName="AccountEdit"
      :singlePreviewCmp="AccountPreview"
      :isLoading="isLoading"
      :showLoader="false"
      @remove="removeAccount"
      @edit="editAccount"
    />
    <Loader v-if="isLoading" />
  </section>
</template>

<script>
import AccountPreview from '../cmps/AccountPreview.vue';
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'AccountPage',
  data() {
    return {
      AccountPreview
    }
  },
  methods: {
    getAccounts(filterBy) {
      this.$store.dispatch({ type: 'account/loadAccounts', filterBy });
    },
    removeAccount(id) {
      this.$store.dispatch({type: 'account/removeAccount', id });
    },
    editAccount(account) {
      this.$store.dispatch({type: 'account/saveAccount', account });
    },
  },
  computed: {
    bugData() {
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
    '$route.params.id'() {
      this.getAccounts();
    }
  },
  components: { AccountPreview, ItemSearchList, Loader }
}
</script>
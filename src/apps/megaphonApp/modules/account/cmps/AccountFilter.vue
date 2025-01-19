<template>
  <form @submit.prevent="emitFilter" class="account-filter flex gap10 align-center space-between width-all">
    <div>
      <div class="flex align-center gap5">
        <FormInput placeholder="search" v-model="filterBy.filter.search" :reactive="true"/>
        <button class="btn" @click="emitFilter">{{$t('search')}}</button>
      </div>
    </div>
    <div v-if="(organizationId === '-1') && (isUserCurrOrgAdmin || isAdmin)" class="flex gap10 align-center justify-end width-all">
      <router-link :to="{ name: 'AccountEdit', params: { organizationId: organizationId } }"><button class="btn primary mid">{{$t('addNew')}}</button></router-link>
      <button class="btn big" @click="getAllAccounts(filterBy, '')" :to="{name: 'AccountPage'}">{{$t('accountLocales.viewAllAccounts')}}</button>
    </div>
    <div class="flex gap20" v-else>
      <InviteAccountModal/>
      <router-link :to="{ name: 'AccountEdit', params: { organizationId: organizationId } }" class="flex"><button class="btn primary mid">{{$t('addNew')}}</button></router-link>
    </div>
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import InviteAccountModal from '../../organization/cmps/InviteAccountModal.vue';
import { organizationService } from '../../organization/services/organization.service';
export default {
  name: 'AccountFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', this.filterBy);
    }
  },
  data() {
    return {
      filterBy: null
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter));
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    isAdmin() {
      return this.$store.getters['auth/isAdmin'];
    },
    isUserCurrOrgAdmin() {
      return organizationService.isUserAdmin(this.organizationId, this.loggedUser);
    },
  },
  watch: {
    '$route.query.roleType'() {
      this.filterBy.filter.search = '';
    }
  },
  components: { FormInput, InviteAccountModal }
}
</script>

<style lang="scss">
.megaphon-app {
  
}
</style>
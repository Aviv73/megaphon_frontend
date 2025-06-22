<template>
  <form @submit.prevent="emitFilter" class="account-filter flex gap10 align-center space-between width-all">
    <div>
      <div class="flex align-center_ gap10">
        <FormInput placeholder="search" v-model="filterBy.filter.search" :reactive="true"/>
        <button class="underline" @click="emitFilter">{{$t('search')}}</button>
      </div>
    </div>
    <div v-if="(organizationId === '-1') && (isUserCurrOrgAdmin || isAdmin)" class="flex gap20 align-center justify-end width-all">
      <router-link :to=" {name: 'AccountEdit', params: { organizationId: organizationId } }"><button class="flex align-center gap10"><span class="flex align-center bold">+<div v-html="svgs.person" class="svg-parrent"></div></span><span>{{$t('addNew')}}</span></button></router-link>
      <button class="hover-pop flex" @click.stop.prevent="getAllAccounts()" :to="{name: 'AccountPage'}">{{$t('accountLocales.viewAllAccounts')}}</button>
    </div>
    <div class="flex gap20" v-else>
      <router-link :to=" {name: 'AccountEdit', params: { organizationId: organizationId } }"><button class="flex align-center gap10"><span class="flex align-center bold">+<div v-html="svgs.person" class="svg-parrent"></div></span><span>{{$t('addNew')}}</span></button></router-link>
      <InviteAccountModal/>
    </div>
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import InviteAccountModal from '../../organization/cmps/InviteAccountModal.vue';
import { organizationService } from '../../organization/services/organization.service';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { getSvgs } from '../../../assets/images/svgs';
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
    },
    getAllAccounts() {
      evManager.emit('get-all-accounts', this.filterBy);
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

    svgs() {
      return getSvgs();
    }
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
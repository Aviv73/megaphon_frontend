<template>
  <router-link v-if="account" :to="{ name: 'AccountEdit', params: { id: account._id, organizationId: orgId } }" class="table-item-preview">
    <p>{{account.name && account.name || `${account.firstName} ${account.lastName}`}}</p>
    <p class="wide-screen-item">{{account.email}}</p>
    <p v-if="isPanding">
      <button class="btn primary" @click.stop.prevent="emitApproval">{{$t('organizationLocales.approveJoin')}}</button>
    </p>
    <p v-else-if="orgId === '-1'">{{account?.roles?.map(c => $t(`organizationLocales.orgRoles.${c}`)).join(', ')}}</p>
    <p v-else>{{accountOrgData?.roles?.map(c => $t(`organizationLocales.orgRoles.${c}`)).join(', ')}}</p>
    <!-- <p>
      <button class="btn primary" v-if="isPanding" @click.stop.prevent="emitApproval">{{$t('approve')}}</button>
      <span v-else>
        {{isPandingMsg}}
      </span>
    </p> -->
  </router-link>
</template>

<script>
import { Utils } from '../../../../common/modules/common/services/util.service';
import { organizationService } from '../../organization/services/organization.service';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { consts } from '@/apps/common/modules/common/services/const.service.js';
export default {
  name: 'AccountPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String]
  },
  computed: {
    account() {
      return this.item
    },
    orgId() {
      return this.$route.params.organizationId
    },
    accountOrgData() {
      return organizationService.getOrgItemInAccount(this.account, this.orgId);
    },
    isPanding() {
      if (this.orgId === '-1') return false;
      return this.accountOrgData?.status === consts.organizationStatuses.pending;
    },
    isPandingMsg() {
      return Utils.vOrX(this.isPanding);
    }
  },
  methods: {
    emitApproval() {
      evManager.emit('approveAccount', this.account, this.orgId);
    }
  }
}
</script>

<style lang="scss">
.megaphon-app {
}
</style>
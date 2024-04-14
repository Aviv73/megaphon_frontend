<template>
  <router-link :to="{ name: 'AccountDetails', params: { id: account._id } }" class="flex align-center gap5 width-content" :style="{flexDirection: reverse? 'row-reverse' : 'row'}">
      <Avatar :account="account"/> <span>{{username}}</span>
  </router-link>
</template>

<script>
import Avatar from '@/apps/common/modules/common/cmps/Avatar.vue';

export default {
  name: "MiniAccountPreview",
  props: {
    account: [Object],
    reverse: [Boolean, undefined]
  },
  computed: {
    username() {
      return this.account.username || `${this.account.firstName} ${this.account.lastName}`;
    }
  },
  components: { Avatar },
}
</script>
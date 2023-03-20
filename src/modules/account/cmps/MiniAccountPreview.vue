<template>
  <router-link :to="{ name: 'AccountDetails', params: { id: account._id } }" class="flex align-center gap5 width-content" :style="{flexDirection: reverse? 'row-reverse' : 'row'}">
      <Avatar :account="account"/> <span>{{account.username}}</span>
  </router-link>
</template>

<script>
import Avatar from '@/modules/common/cmps/Avatar.vue';

export default {
  name: "MiniAccountPreview",
  props: {
    account: [Object],
    reverse: [Boolean, undefined]
  },
  components: { Avatar },
}
</script>
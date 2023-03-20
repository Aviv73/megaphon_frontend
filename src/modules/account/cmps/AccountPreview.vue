<template>
  <li class="account-preview item-preview flex column gap20 align-start">
    <button v-if="!isSelf" class="btn danger" @click.stop="toggleBlockUser">{{$t(account.blocked? 'account.unBlock' : 'account.block')}}</button>
    <router-link :to="{ name: 'AccountDetails', params: { id: account._id } }" class="flex column align-start gap20">
      <!-- <pre>{{account}}</pre> -->
      <MiniAccountPreview :account="account"/>
      <h3>{{account.firstname}} {{account.lastname}}</h3>
      <p>{{account.email}}</p>
    </router-link>
  </li>
</template>

<script>
import MiniAccountPreview from './MiniAccountPreview.vue'
export default {
  components: { MiniAccountPreview },
  name: 'AccountPreview',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    account() {
      return this.item;
    },
    isSelf() {
      return this.account._id === this.$store.getters['auth/loggedUser']?._id;
    }
  },
  methods: {
    toggleBlockUser() {
      this.$emit('edit', {
        ...JSON.parse(JSON.stringify(this.account)),
        blocked: !this.account.blocked
      })
    }
  }
}
</script>
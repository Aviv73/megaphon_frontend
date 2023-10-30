<template>
  <router-link v-if="contact" :to="{ name: 'AccountEdit', params: { id: contact._id, organizationId: $route.params.organizationId } }" class="table-item-preview">
    <p>{{contact.name && contact.name || `${contact.firstName} ${contact.lastName}`}}</p>
    <p>{{contact.email}}</p>
    <p>{{contact.role}}</p>
  </router-link>
</template>

<script>
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
    contact() {
      return this.item
    },
  }
}
</script>

<style lang="scss">
.megaphon-app {
}
</style>
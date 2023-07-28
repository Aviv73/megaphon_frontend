<template>
  <router-link v-if="organization" :to="{ name: 'OrganizationEdit', params: { id: organization._id, } }" class="table-item-preview">
    <p>{{organization.name}}</p>
  </router-link>
</template>

<script>
export default {
  name: 'OrganizationPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String]
  },
  computed: {
    organization() {
      return this.item
    },
  }
}
</script>

<style lang="scss">
.megaphon-app {
}
</style>
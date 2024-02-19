<template>
  <router-link v-if="contact" :to="{ name: 'ContactEdit', params: { id: contact._id, organizationId: $route.params.organizationId } }" class="table-item-preview contact-preview" :class="{unsubscribed: contact.unsubscribed}">
    <p>{{contact.email}}</p>
    <p>{{contact.firstName}} {{contact.lastName}}</p>
    <p>{{contact.role}}</p>
    <p>{{companiesToShow.join(', ')}}</p>
    <p>{{contact.unsubscribed? '✔' : '-'}}</p>
  </router-link>
</template>

<script>
export default {
  name: 'ContactPreview',
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
    allCompanies() {
      return this.$store.getters['company/items'];
    },
    companiesToShow() {
      return this.contact?.company.map(c => this.allCompanies.find(comp => comp._id === c)?.name) || [];
    }
  }
}
</script>

<style lang="scss">
.megaphon-app {
  .contact-preview {
    // position: relative;
    // width: 100%;
    &.unsubscribed {
      opacity: 0.7;
    }
  }
}
</style>
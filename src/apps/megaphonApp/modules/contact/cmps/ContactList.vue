<template>
  <div class="table-like-list flex-1">
    <div class="table-item-preview gap10 table-header flex space-between">
      <p class="flex-1" v-for="field in fields" :key="field.label">{{$t(field.label)}}</p>
    </div>
    <ContactPreview 
      class="gap10"
      v-for="contact in contacts" :key="contact._id"
      :item="contact"
      :fields="fields.map(c => c.field)"
      :asLink="asLink"
    />
  </div>
</template>

<script>
import ContactPreview from './ContactPreview.vue'
export default {
  components: { ContactPreview },
  name: 'ContactList',
  props: {
    contacts: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      default: () => ['email', 'name', 'role', 'company', 'unsubscribed'].map(c => ({ field: c, label: c }))
    },
    asLink: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
.megaphon-app {
  .contact-list {
  }
}
</style>
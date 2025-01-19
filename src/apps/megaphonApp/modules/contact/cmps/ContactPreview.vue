<template>
  <component
    :is="asLink? 'router-link' : 'div'"
    v-if="contact"
    :to="{ name: 'ContactEdit', params: { id: contact._id, organizationId: $route.params.organizationId } }"
    class="table-item-preview contact-preview"
    :class="{unsubscribed: contact.unsubscribed}"
  >
    <p class="flex-1" v-for="field in fields" :key="field" :class="getVal(field)">
      <!-- <template v-if="field === 'toggleBtn'">
        <button v-if="" class="toggle-btn" @click="toggleContact(contact)">
          <img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>
          {{$t('distributeLocales.remove')}}
        </button>
      </template>
      <template v-else>
      </template> -->
        {{getVal(field) || '-'}}
    </p>
    <slot v-if="$slots.default"/>
    <!-- <p>{{contact.email}}</p>
    <p>{{contact.firstName}} {{contact.lastName}}</p>
    <p>{{contact.role}}</p>
    <p>{{companiesToShow.join(', ')}}</p>
    <p>{{contact.unsubscribed? '✔' : '-'}}</p> -->
  </component>
</template>

<script>
import { contactService } from '../contact.service';
export default {
  name: 'ContactPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String],
    fields: {
      type: Array,
      default: () => ['email', 'name', 'role', 'company', 'unsubscribed']
    },
    asLink: {
      type: Boolean,
      default: true
    },
    // includes: {
    //   type: Boolean,
    //   default: false
    // }
  },
  methods: {
    getVal(field) {
      const { contact } = this;
      switch (field) {
        case 'name':
          // return contact.name || (contact.firstName && (contact.firstName + ' ' + (contact.lastName || ''))) || '';
          return contactService.getContactPreviewName(contact);
        case 'company':
          return (contact.company?.map(c => this.allCompanies.find(comp => comp._id === c)?.name) || []).join(', ');
        case 'unsubscribed':
          return contact.unsubscribed? '✔' : '-'
        default:
          return contact[field];

      }
    }
  },
  computed: {
    contact() {
      return this.item
    },
    allCompanies() {
      return this.$store.getters['company/items'];
    },
    // companiesToShow() {
    //   return this.contact?.company.map(c => this.allCompanies.find(comp => comp._id === c)?.name) || [];
    // }
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
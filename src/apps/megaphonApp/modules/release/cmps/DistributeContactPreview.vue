<template>
  <div v-if="contact" class="table-item-preview contact-preview" :class="{unsubscribed: contact.unsubscribed}">
    <!-- <p v-if="contact.firstName">{{contact.firstName}} {{contact.lastName}}</p>
    <p v-else>{{contact.email}}</p> -->
    <p>{{contactPreviewName}}</p>
    <p class="wide-screen-item">{{contact.role}}</p>
    <p class="wide-screen-item">{{companiesToShow.join(', ')}}</p>
    <template v-if="!contact.unsubscribed">
      <button class="toggle-btn" v-if="isAdded" @click="toggleContact"><img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>{{$t('distribute.remove')}}</button>
      <button class="toggle-btn" v-else @click="toggleContact"><img :src="require('@/apps/megaphonApp/assets/images/add_contact.svg')"/>{{$t('add')}}</button>
    </template>
    <p v-else>{{$t('contact.unsubscribed')}}</p>
  </div>
</template>

<script>
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { contactService } from '../../contact/contact.service';
export default {
  name: 'DistributeContactPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String],
    contactsForDistribute: [Array]
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
    },

    isAdded() {
      return !!this.contactsForDistribute.find(c => c._id === this.contact._id);
    },

    contactPreviewName() {
      return contactService.getContactPreviewName(this.contact);
    }
  },
  methods: {
    toggleContact() {
      evManager.emit('toggle-distribute-contact', this.contact);
    }
  }
}
</script>

<style lang="scss">
.megaphon-app {
  .contact-preview {
    position: relative;
    width: 100%;
  }
}
</style>
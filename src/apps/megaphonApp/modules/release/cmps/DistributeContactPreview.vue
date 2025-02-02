<template>
  <div v-if="contact" class="table-item-preview contact-preview gap10" :class="{unsubscribed: contact.unsubscribed}">
    <!-- <p v-if="contact.firstName">{{contact.firstName}} {{contact.lastName}}</p>
    <p v-else>{{contact.email}}</p> -->
    <p :title="contactPreviewName">{{contactPreviewName}}</p>
    <p class="wide-screen-item" :title="contact.email">{{contact.email}}</p>
    <p class="wide-screen-item" :title="companiesToShow.join(', ')">{{companiesToShow.join(', ')}}</p>
    <p class="wide-screen-item" :title="tagsToShow.join(', ')">{{tagsToShow.join(', ')}}</p>
    <template v-if="!contact.unsubscribed">
      <button class="toggle-btn" v-if="isAdded" @click="toggleContact"><img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>{{$t('distributeLocales.remove')}}</button>
      <button class="toggle-btn" v-else @click="toggleContact"><img :src="require('@/apps/megaphonApp/assets/images/add_contact.svg')"/>{{$t('add')}}</button>
    </template>
    <p v-else>{{$t('contactLocales.unsubscribed')}}</p>
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
    allTags() {
      return this.$store.getters['tag/items'];
    },
    companiesToShow() {
      return this.contact?.company.map(c => this.allCompanies.find(comp => comp._id === c)?.name) || [];
    },
    tagsToShow() {
      return this.contact?.tags.map(c => this.allTags.find(tag => tag._id === c)?.name) || [];
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
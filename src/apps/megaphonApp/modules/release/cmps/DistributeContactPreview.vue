<template>
  <div v-if="contact" class="table-item-preview contact-preview gap10" :class="{unsubscribed: contact.unsubscribed}">
    <!-- <p v-if="contact.firstName">{{contact.firstName}} {{contact.lastName}}</p>
    <p v-else>{{contact.email}}</p> -->
    <p class="flex-2" :title="contactPreviewName">{{contactPreviewName}}</p>
    <p class="wide-screen-item flex-2" :title="contact.email">{{contact.email}}</p>
    <ClipTxt class="wide-screen-item flex-1" :maxLength="40" :txt="companiesToShow.join(', ') || '-'"/>
    <ClipTxt class="wide-screen-item flex-1" :maxLength="40" :txt="tagsToShow.join(', ') || '-'"/>
    <template v-if="!contact.unsubscribed">
      <button class="toggle-btn bold hover-pop" v-if="isAdded" @click="toggleContact">-<div v-html="svgs.person" class="svg-parrent"></div></button>
      <button class="toggle-btn bold hover-pop" v-else @click="toggleContact">+<div v-html="svgs.person" class="svg-parrent"></div></button>
    </template>
    <p v-else>{{$t('contactLocales.unsubscribed')}}</p>
  </div>
</template>

<script>
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { contactService } from '../../contact/contact.service';
import ClipTxt from '../../../../common/modules/common/cmps/ClipTxt.vue';
import { getSvgs } from '../../../assets/images/svgs';
export default {
  components: { ClipTxt },
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
    },
    svgs() {
      return getSvgs();
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
    .txt-cliper {
      button {
        display: none;
      }
    }
  }
}
</style>
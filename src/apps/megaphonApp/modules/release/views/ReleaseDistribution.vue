<template>
  <div class="release-distribute flex column gap20 container" v-if="release && org">
    <div class="flex align-center space-between gap10 width-all wrap-reverse">
      <div class="flex align-center gap20">
        <router-link :to="{ name: 'ReleaseEdit', params: {organizationId, id: $route.params.id} }"><button class="btn big">{{$t('distribute.backToEditRelease')}}</button></router-link>
        <router-link v-if="isRoleInOrg('admin')" :to="{ name: 'ReleaseReport', params: {organizationId, id: $route.params.id} }"><button class="btn big">{{$t('distribute.report')}}</button></router-link>
      </div>
      <h2>{{$t('distribute.distributeRelease')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
    </div>
    <p v-if="!isLoading && !distributionTemplate && false">{{$t('distribute.noMatchingDesignTemplateFound')}}</p>
    <template v-else>
      <div class="flex gap30 width-all flex-1 main-content">
        <div style="flex:3" class="flex column gap10">
          <div class="tab-nav light">
            <button @click="loadSystemContacts = true" :class="{selected: loadSystemContacts}">{{$t('distribute.contactsToDistribute')}}</button>
            <button @click="loadSystemContacts = false" :class="{selected: !loadSystemContacts}">{{$t('distribute.selfContacts')}}</button>
          </div>
          <ItemSearchList
            class="table-like-list"
            :itemsData="allContactData"
            :initFilterBy="filterBy"
            @filter="getContacts"
            itemDetailesPageName="ContactDetails"
            newItemPageName="ContactEdit"
            :singlePreviewCmp="DistributeContactPreview"
            :filterByCmp="ContactFilter"
            :showActions="false"
            :dontRoute="true"
            :showLoader="false"
            :propsToPass="{
              contactsForDistribute,
              organizationId: loadSystemContacts? '-1' : organizationId
            }"
          >
            <div class="table-item-preview gap10 table-header">
              <p>{{$t('contact.contactName')}}</p>
              <p class="wide-screen-item">{{$t('contact.role')}}</p>
              <p class="wide-screen-item">{{$t('contact.companyName')}}</p>
              <div>
                <button class="toggle-btn" @click="addAllSearchContacts()">
                  <img class="add-all-btn-img reg" :src="require('@/apps/megaphonApp/assets/images/add_contact_white.svg')"/>
                  <img class="add-all-btn-img dark" :src="require('@/apps/megaphonApp/assets/images/add_contact.svg')"/>
                  {{$t('distribute.addAll')}}
                </button>
              </div>
            </div>
          </ItemSearchList>
        </div>

        <div style="flex:1.5" class="distribute-detailes flex column gap20">
          <div class="flex align-center space-between">
            <h3>{{contactsForDistribute.length}} {{$t('distribute.contactsWasSelected')}}</h3>
            <!-- <button class="btn" @click="copyUrlToClipboard">{{$t('distribute.copyReleaseDistributionUrl')}} <img class="ico-img" :src="require('@/assets/images/icons/url.png')" alt=""></button> -->
            <ReleaseDistributionLinkCoppier :release="this.release" :organization="this.org"/>
          </div>
          <div class="width-all flex column gap5">
            <p>{{$t('distribute.fromEmail')}}</p>
            <div class="flex align-center space-between gap10">
              <!-- <FormInput type="select" :items="fromEmails.map(c => ({value: c.email, label: c.title}))" :value="fromEmail"/> -->
              <FormInput class="flex-1" placeholder="email" type="autocomplete" :items="fromEmails.map(c => ({value: c.email, label: c.email}))" v-model="fromEmail.email" @change="val => onFromEmailChanged(val)"/>
              <FormInput class="flex-1" placeholder="name" type="text" v-model="fromEmail.title"/>
              <FormInput class="flex-1 ltr" label="distribute.allowReply" type="checkbox" v-model="fromEmail.allowReply"/>

            </div>
          </div>
          <FormInput class="width-all space-between row-reverse" label="distribute.forceDistribute" type="checkbox" v-model="isForceDistribute"/>
          <div class="load-distributions-section flex align-center space-between gap5">
            <button @click="showEmailListsSelectionModal = true" class="btn">{{$t('distribute.loadDistributionList')}} <img class="ico-img" :src="require('@/apps/megaphonApp/assets/images/load_cloud.svg')"/></button>
            <button @click="showAddMailingListItemModal = true" class="btn">{{$t('distribute.saveDistributionList')}} <img class="ico-img" :src="require('@/apps/megaphonApp/assets/images/save_black.svg')"/></button>
          </div>
          <div class="width-all flex column gap5">
            <p>{{$t('distribute.addCustomContact')}}</p>
            <form @submit.prevent="addCustomContact" class="width-all flex space-between gap10">
              <FormInput class="flex-1" placeholder="distribute.customEmailToAdd" v-model="customEmailToAdd"/>
              <button class="btn">{{$t('distribute.add')}}</button>
            </form>
          </div>
          <div class="table-like-list flex-1 selected-table">
            <div class="table-item-preview selected-input gap10 table-header flex space-between">
              <!-- <p>{{$t('contact.contactName')}}</p> -->
              <FormInput :placeholder="$t('contact.contactName')" v-model="searchSelectedTerm"/>
              <button class="toggle-btn" @click="contactsForDistribute = []"><img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>{{$t('distribute.removeAll')}}</button>
          </div>
            <div v-for="contact in contactsForDistributeToShow" :key="contact._id" class="table-item-preview gap10 flex align-center space-between" :class="{unsubscribed: contact.unsubscribed}">
              <p>{{contact.name || (contact.firstName && (contact.firstName + ' ' + (contact.lastName || ''))) || contact.email || ''}}</p>
              <button class="toggle-btn" @click="toggleContact(contact)"><img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>{{$t('distribute.remove')}}</button>
            </div>
            <!-- <div class="item-list">
            </div> -->
          </div>
        </div>
      </div>
      <footer class="flex align-center justify-end gap10 width-all">
        <button @click="sendTestEmail" class="btn big">{{$t('distribute.sendTestMail')}}</button>
        <button @click="distribute()" class="btn big">{{$t('distribute.confirmAndDistribute')}}</button>
      </footer>

      <Modal :fullScreen="true" v-if="showEmailListsSelectionModal" @close="showEmailListsSelectionModal = false">
        <div class="flex column gap10 mailing-lists-modal mailing-list-list">
          <template v-if="emailLists?.length">
            <p>{{$t('distribute.loadDistributionList')}}</p>
            <div class="table-like-list flex-1 selected-table">
              <div class="table-item-preview gap10 table-header flex space-between">
                <p>{{$t('distribute.mailingList')}}</p>
              </div>
              <div v-for="list in emailLists" :key="list._id" class="table-item-preview gap10 list-item flex align-center space-between " @click="selectMailingList(list)">
                <p>{{list.title}}</p>
                <button @click.stop="onRemoveMailingList(list)">X</button>
              </div>
            </div>
          </template>
          <p v-else>{{$t('distribute.noMailingListsFound')}}..</p>
          <div class="width-all flex justify-end">
            <button @click="showEmailListsSelectionModal = false" class="btn">{{$t('close')}}</button>
          </div>
        </div>
      </Modal>
      <Modal :fullScreen="true" v-else-if="showAddMailingListItemModal" @close="showAddMailingListItemModal = false">
        <div class="flex column gap10 new--lists-modal">
          <template v-if="contactsForDistribute?.length">
            <p>{{$t('distribute.saveDistributionList')}}</p>
            <form @submit.prevent="createMailingList" class="flex space-between gap10">
              <FormInput v-model="newMailingListName" placeholder="name"/>
              <button class="btn">{{$t('create')}}</button>
            </form>
            <div class="table-like-list flex-1 selected-table mailing-list-list">
              <div v-for="list in emailLists" :key="list._id" class="table-item-preview gap10 list-item flex align-center space-between" @click="updateMailingList(list)">
                <p>{{list.title}}</p>
              </div>
            </div>
          </template>
          <p v-else>{{$t('distribute.cantCreateEmptyMailingList')}}..</p>
          <div class="width-all flex justify-end">
            <button @click="showAddMailingListItemModal = false" class="btn">{{$t('close')}}</button>
          </div>
        </div>
      </Modal>
      <Modal :fullScreen="true" v-else-if="showDistributionReportModal && distributionReport">
        <div class="flex column gap30 distribution-report-modal">
          <div class="flex space-between">
            <p>{{$t('distribute.sccessfullyDistributedReleaseTo')}} <span class="ltr">{{distributionReport.sentToUsers.length}}/{{distributionReport.sentToUsers.length + distributionReport.faildSendToUsers.length + distributionReport.allreadyDistributedTo.length + distributionReport.unsubscribedContacts.length}}</span> {{$t('contact.contacts')}}.</p>
            <button @click="showDistributionReportModal = false" class="btn">{{$t('close')}}</button>
          </div>
          <div class="flex column gap20 distribution-report-modal-content">
            <div class="flex column gap10 new--lists-modal" v-if="distributionReport.faildSendToUsers.length">
              <p>{{$t('distribute.cantSenDistributionTo')}} {{distributionReport.faildSendToUsers.length}} {{$t('contact.contacts')}}:</p>
              <ContactList :contacts="distributionReport.faildSendToUsers" :fields="[{label: $t('contact.contactName'), field: 'name'}, {label: 'email', field: 'email'}]"/>
              <div><button class="btn big primary" @click="tryDistributeAgain">{{$t('distribute.tryAgain')}}</button></div>
            </div>
            <div class="flex column gap10 new--lists-modal" v-if="distributionReport.allreadyDistributedTo.length">
              <p>{{$t('distribute.alreadyDistributedToContacts')}} {{distributionReport.allreadyDistributedTo.length}} {{$t('contact.contacts')}}:</p>
              <ContactList :contacts="distributionReport.allreadyDistributedTo" :fields="[{label: $t('contact.contactName'), field: 'name'}, {label: 'email', field: 'email'}]"/>
            </div>
            <div class="flex column gap10 new--lists-modal" v-if="distributionReport.unsubscribedContacts.length">
              <p>{{$t('distribute.unsubscribedContacts')}} {{distributionReport.unsubscribedContacts.length}} {{$t('contact.contacts')}}:</p>
              <ContactList :contacts="distributionReport.unsubscribedContacts" :fields="[{label: $t('contact.contactName'), field: 'name'}, {label: 'email', field: 'email'}]"/>
            </div>
            <div class="width-all flex justify-end">
              <button @click="showDistributionReportModal = false" class="btn">{{$t('close')}}</button>
            </div>
          </div>
        </div>
      </Modal>
    </template>
    <Loader :fullScreen="true" v-if="isLoading" 
      :msg="isLoadingForDist? `
        <div class='flex column align-center'>
          <p>${$t('distribute.loadingMsg')}</p>
          <p class='ltr'>${sendingToStatus.sent}/${sendingToStatus.total}</p>
        </div>`
      : ''"/>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import DistributeContactPreview from '../cmps/DistributeContactPreview.vue';
import ContactFilter from '../../contact/cmps/ContactFilter.vue';
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { contactService } from '../../contact/contact.service';
import { distributionService } from '../services/distribution.service.js';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import Modal from '@/apps/common/modules/common/cmps/Modal.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import { copyToClipBoard, getRandomId } from '../../../../common/modules/common/services/util.service';
import ReleaseDistributionLinkCoppier from '../cmps/ReleaseDistributionLinkCoppier.vue';
import ContactList from '../../contact/cmps/ContactList.vue';
import { organizationService } from '../../organization/services/organization.service';

import config from '@/config';

const minimizeContact = ({_id, email, unsubscribed, name}) => ({_id, email, unsubscribed, name});

export default {
  name: 'ReleaseDistribute',
  data() {
    return {
      release: null,
      org: null,
      loadSystemContacts: true,

      DistributeContactPreview,
      ContactFilter,

      contactsForDistribute: [],

      fromEmail: {
        email: '',
        title: '',
        allowReply: false
      },
      isForceDistribute: false,

      customEmailToAdd: '',

      emailLists: [],
      isLoadingLocal: false,
      showEmailListsSelectionModal: false,

      showAddMailingListItemModal: false,
      newMailingListName: '',

      distributionReport: null,
      showDistributionReportModal: false,

      searchSelectedTerm: '',
      isLoadingForDist: false,

      sendingToStatus: {
        total: 0,
        sent: 0,
      }
    }
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    allContactData() {
      return this.$store.getters['contact/data'];
    },
    filterBy() {
      return this.$store.getters['contact/filterBy'];
    },
    isLoading() {
      return this.$store.getters['contact/organization'] || this.$store.getters['contact/isLoading'] || this.$store.getters['release/isLoading'] || this.isLoadingLocal;
    },

    fromEmails() {
      return this.org.fromEmails || [];
    },

    distributionTemplate() {
      return templateUtils.getReleaseRelevantTemplateItem?.(this.release, this.org, true) || null;
    },

    contactsForDistributeToShow() {
      if (!this.searchSelectedTerm) return this.contactsForDistribute;
      return this.contactsForDistribute.filter(c => {
        return c.name?.toLowerCase?.().includes(this.searchSelectedTerm.toLowerCase()) || c.email?.toLowerCase?.().includes(this.searchSelectedTerm.toLowerCase());
      })
    },

    sendInEmailUrl() {
      // &token=${getRandomId('')}
      return templateUtils.getReleaseLandingPageUrl(this.release, this.org, false, config) + `?releaseId=${this.release?._id}&origin=email&token=`;
    },

    
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },

  methods: {
    isRoleInOrg(role) {
      return organizationService.isUserRoleInOrg(this.org?._id, role, this.loggedUser);
    },
    onFromEmailChanged(val) {
      const fromEmailItem = this.fromEmails.find(c => c.email === val);
      this.fromEmail.title = fromEmailItem?.title || ''
      this.fromEmail.allowReply = fromEmailItem?.allowReply || false;
    },
    // copyUrlToClipboard() {
    //   copyToClipBoard(this.sendInEmailUrl);
    //   alertService.toast({ msg: this.$t(`copiedToClipboard`), type: 'safe' });
    // },
    async getItem() {
      this.release = await this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id, organizationId: this.organizationId });
    },
    async getOrg() {
      this.org = await this.$store.dispatch({ type: 'organization/loadItem', id: this.organizationId });
      const defaultItem = this.org.fromEmails?.find(c => c.isDefault) || this.org.fromEmails?.[0];
      if (defaultItem) this.fromEmail = {...defaultItem};
    },
    close() {
      this.$router.push({ name: 'ReleasePage', params: { organizationId: this.organizationId } })
    },
    getContacts(filterBy) {
      filterBy = filterBy || this.filterBy
      // this.$store.dispatch({ type: 'contact/loadItems', filterBy: {...filterBy, loadSystemContacts: this.loadSystemContacts }, organizationId: this.organizationId });
      this.$store.dispatch({ type: 'contact/loadItems', filterBy: {...filterBy, includeUnsubscribed: true }, organizationId: this.loadSystemContacts? '-1' : this.organizationId });
    },

    addContact(contact) {
      if (!contact?.email) return;
      const idx = this.contactsForDistribute.findIndex(c => c.email === contact.email);
      if (idx === -1) this.contactsForDistribute.unshift(contact);
    },
    toggleContact(contact) {
      const idx = this.contactsForDistribute.findIndex(c => c.email === contact.email);
      if (idx === -1) this.contactsForDistribute.unshift(contact);
      else this.contactsForDistribute.splice(idx, 1);
    },

    async addAllSearchContacts() {
      this.isLoadingLocal = true;
      try {
        const contactsToAdd = await contactService.query({...this.filterBy, pagination: undefined, loadSystemContacts: this.loadSystemContacts}, this.organizationId);
        contactsToAdd.items.forEach(this.addContact);
      } catch (err) {
        console.error(err);
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.cantAddContacts`) });
      }
      this.isLoadingLocal = false;
    },
    addCustomContact() {
      if (!this.customEmailToAdd) return;
      const newContact = { name: this.customEmailToAdd, email: this.customEmailToAdd };
      this.addContact(newContact);
      this.customEmailToAdd = ''; // TODO:: doesnt work;;
    },


    async distribute(contacts) {
      const isToSend = await alertService.Confirm(this.$t('distribute.distributeReleaseConfirmMsg'));
      if (!isToSend) return;
      try {
        this.sendingToStatus.total = (contacts || this.contactsForDistribute).length;
        this.sendingToStatus.sent = 0;
        this.isLoadingLocal = true;
        this.isLoadingForDist = true;
        const res = await distributionService.distribute(this.organizationId, this.release._id, { 
          from: this.fromEmail,
          contacts: (contacts || this.contactsForDistribute).map(minimizeContact),
          forceDistribute: this.isForceDistribute
        },
        updatedSentToCount => this.sendingToStatus.sent = updatedSentToCount);
        // alertService.toast({ msg: `Successfully distributed release to ${res.sentToUsers.length} out of ${this.contactsForDistribute.length} contacts` });
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.successDistRelease`), type: 'safe' });
        console.log(res);
        this.distributionReport = res;
        this.showDistributionReportModal = true;
      } catch(err) {
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.errorDistRelease`) });
      }
      this.sendingToStatus.total = 0;
      this.sendingToStatus.sent = 0;
      this.isLoadingLocal = false;
      this.isLoadingForDist = false;
    },
    async sendTestEmail() {
      const testEmail = await alertService.Prompt(this.$t('distribute.testEmail'), this.$t('distribute.testEmail'), localStorage.testEmailVal);
      if (!testEmail) return;
      localStorage.testEmailVal = testEmail;
      this.isLoadingLocal = true;
      try {
        const res = await distributionService.testDistribute(this.organizationId, this.release._id, { 
          from: this.fromEmail,
          contacts: [{ email: testEmail }]
        });
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.testDistSentSuccess`), type: 'safe' });
      } catch(err) {
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.testDistSentError`) });
      }
      this.isLoadingLocal = false;
    },

    async tryDistributeAgain() {
      this.distribute(this.distributionReport.faildSendToUsers);
    },


    async getMailingLists() {
      const listsData = await distributionService.queryMailingLists(this.organizationId);
      this.emailLists = listsData.items;
      // this.isLoadingLocal = true;
      // try {
      //   const listsData = await distributionService.queryMailingLists(this.organizationId);
      //   this.emailLists = listsData.items;
      //   this.showEmailListsSelectionModal = true;
      // } catch(err) {
      //   alertService.toast({ msg: `Somethind went wrong, cant load mailing lists` });
      // }
      // this.isLoadingLocal = false;
    },
    selectMailingList(list) {
      this.contactsForDistribute = [
        ...this.contactsForDistribute,
        ...list.contacts
          // .filter(c => !c.unsubscribed)
          .filter(c => !this.contactsForDistribute.find(_ => _.email === c.email))
      ];
      this.showEmailListsSelectionModal = false;
    },

    async createMailingList() {
      if (!this.newMailingListName) {
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.noMailingListNameError`) })
        return;
      }
      this.isLoadingLocal = true;
      try {
        const newListItem = {
          contacts: this.contactsForDistribute.map(minimizeContact),
          title: this.newMailingListName,
          organizationId: this.organizationId
        }
        await distributionService.addMailingList(this.organizationId, newListItem);
        this.newMailingListName = '';
        this.showAddMailingListItemModal = false;
      } catch(err) {
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.createMailingListError`) });
      }
      this.isLoadingLocal = false;
      this.getMailingLists();
    },
    async updateMailingList(mailingListItem) {
      this.isLoadingLocal = true;
      try {
        const newListItem = {
          ...mailingListItem,
          contacts: this.contactsForDistribute,
        }
        await distributionService.updateMailingList(this.organizationId, newListItem);
        this.newMailingListName = '';
        this.showAddMailingListItemModal = false;
      } catch(err) {
        alertService.toast({ msg: this.$t(`distribute.alertMsgs.updateMailingListError`) });
      }
      this.isLoadingLocal = false;
      this.getMailingLists();
    },
    async onRemoveMailingList(list) {
      if (!await alertService.Confirm(this.$t('distribute.alertMsgs.confirmRemovemailingListMsg'))) return;
      this.isLoadingLocal = true;
      await distributionService.removeMailingList(this.organizationId, list._id);
      await this.getMailingLists();
      this.isLoadingLocal = false;
    }
  },
  
  created() {
    this.getItem();
    this.getOrg();
    this.$store.commit('contact/resetFilter');
    this.getContacts();
    this.getMailingLists();

    evManager.on('toggle-distribute-contact', this.toggleContact);
  },
  destroyed() {
    evManager.off('toggle-distribute-contact', this.toggleContact);

  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    },
    organizationId() {
      this.getContacts();
    },
    loadSystemContacts() {
      this.getContacts();
    }

  },
  components: {
    FormInput,
    ItemSearchList, Loader, DistributeContactPreview, ContactFilter,
    Modal,
    ReleaseDistributionLinkCoppier,
    ContactList,
  },


}
</script>


<style lang="scss">
@import '@/assets/styles/global/index';
.dark-theme .megaphon-app {
  .release-distribute {
    .add-all-btn-img {
      &.reg { display: none; }
      &.dark { display: unset; }
    }
  }
  .selected-input {
    input {
      color: black !important;
    }
  }
}
.megaphon-app {
  .release-distribute {
    padding: em(10px);

    .main-content {
      @media (max-width: $small-screen-breake) {
        flex-direction: column-reverse;
        gap: em(50px);
        .distribute-detailes {
          border-bottom: 1px solid black;
          padding-bottom: em(50px);
        }
      }
    }

    .selected-input {
      input {
        color: white;
      }
    }

    .add-all-btn-img.dark {
      display: none;
    }

    .toggle-btn {
      display: flex;
      align-items: center;
      gap: em(5px);
      img {
        height: em(20px);
        width: unset;
      }
    }

    .selected-table {
      overflow: auto;
      // flex: 0 1 auto;
      max-height: em(500px);
      .table-item-preview {
        >:nth-child(2) {
          flex: unset;
        }
      }
    }

    .unsubscribed {
      opacity: 0.7;
    }

    .mailing-list-list {
      min-width: em(300px);
      .list-item {
        cursor: pointer;
      }
    }

    .load-distributions-section {
      font-size: em(15px);
      button {
        // box-shadow: none;
        // img {
        //   height: em(15px);
        // }
      }
    }

    .distribution-report-modal {
      max-height: 70vh;
      min-width: 50vw;
      max-width: 80vw;
      .selected-table {
        max-height: 50vh;
      }

      .distribution-report-modal-content {
        padding-bottom: rem(20px);
      }
    }
  }
}
</style>
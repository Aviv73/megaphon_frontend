<template>
  <div class="release-distribute flex column gap20" v-if="release && org">
    <div class="flex align-center space-between gap10 width-all wrap-reverse full-screen-container">
      <h2>{{$t('distributeLocales.distributeRelease')}}<span v-if="release.releaseData?.title">: {{release.releaseData.title}}</span></h2>
      <div class="flex align-center gap20" v-if="false">
        <router-link :to="{ name: 'ReleaseEdit', params: {organizationId, id: $route.params.id} }"><button class="btn big">{{$t('distributeLocales.backToEditRelease')}}</button></router-link>
        <router-link v-if="isRoleInOrg('admin')" :to="{ name: 'ReleaseReport', params: {organizationId, id: $route.params.id} }"><button class="btn big">{{$t('distributeLocales.report')}}</button></router-link>
      </div>
    </div>
    <p v-if="!isLoading && !distributionTemplate && false">{{$t('distributeLocales.noMatchingDesignTemplateFound')}}</p>
    <template v-else>
      <div class="flex gap30 width-all flex-1 main-content full-screen-container">
        <div style="flex:3" class="flex column gap10_ main-content-side">
          <div class="side-pre-header-item flex align-center gap20 space-between wrap">
            <div class="tab-nav_ light flex align-center gap10" v-if="!org.dontUseGlobalDbData">
              <button class="underline hover-pop" @click="loadSystemContacts = true" v-if="!org.dontUseGlobalDbData" :class="{bold: loadSystemContacts}">{{$t('distributeLocales.contactsToDistribute')}}</button>
              <button class="underline hover-pop" @click="loadSystemContacts = false" :class="{bold: !loadSystemContacts}">{{$t('distributeLocales.selfContacts')}}</button>
            </div>
            <div v-else></div>
            <!-- <ReleaseDistributionLinkCoppier :release="this.release" :organization="this.org"/> -->
            <div class="flex wrap align-center gap20">
              <FormInput class="force-distribution " label="distributeLocales.forceDistribute" type="checkbox" v-model="isForceDistribute"/>
              <FormInput class="" label="distributeLocales.testMode" type="checkbox" v-model="testMode"/>      
            </div>
          </div>
          <div class="flex align-center space-between gap10 side-header-item">
            <!-- <FormInput type="select" :items="fromEmails.map(c => ({value: c.email, label: c.title}))" :value="fromEmail"/> -->
            <FormInput class="flex-1" :label="$t('distributeLocales.fromEmail') + ':'" placeholder="email" type="autocomplete" :items="fromEmails.map(c => ({value: c.email, label: c.email}))" v-model="fromEmail.email" @change="val => onFromEmailChanged(val)"/>
            <FormInput class="flex-1" labelholder="distributeLocales.fromName" type="text" v-model="fromEmail.title"/>
            <FormInput class="flex-1_" label="distributeLocales.allowReply" type="checkbox" v-model="fromEmail.allowReply"/>
          </div>
          <ItemSearchList
            class="table-like-list contacts-selection-list"
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
            layoutMode="flex"
          >
            <template v-slot:listHeader>
              <div class="table-item-preview gap10 table-header">
                <p class="flex-2">{{$t('contactLocales.contactName')}}</p>
                <p class="wide-screen-item flex-2">{{$t('email')}}</p>
                <p class="wide-screen-item flex-1">{{$t('contactLocales.companyName')}}</p>
                <p class="wide-screen-item flex-1">{{$t('contactLocales.tags')}}</p>
                <div class="flex">
                  <button class="toggle-btn bold hover-pop" @click="addAllSearchContacts()">
                    <!-- <img class="add-all-btn-img reg" :src="require('@/apps/megaphonApp/assets/images/add_contact_white.svg')"/>
                    <img class="add-all-btn-img dark" :src="require('@/apps/megaphonApp/assets/images/add_contact.svg')"/> -->
                    <!-- <img class="add-all-btn-img" :src="require('@/apps/megaphonApp/assets/images/add_contact.svg')"/> -->
                    +<div v-html="svgs.person" class="svg-parrent"></div>
                    <!-- {{$t('distributeLocales.addAll')}} -->
                  </button>
                </div>
              </div>
            </template>
          </ItemSearchList>
        </div>

        <div style="flex:1.5" class="distribute-detailes flex column gap20_ main-content-side">
          <div class="load-distributions-section flex align-center justify-end gap30 side-pre-header-item">
            <button @click="showMailingListSelectionModal = true" class="hover-pop flex align-center gap5"><div v-html="svgs.loadCloud" class="svg-parrent"></div>{{$t('distributeLocales.loadDistributionList')}}</button>
            <button @click="showAddMailingListItemModal = true" class="hover-pop flex align-center gap5"><div v-html="svgs.save" class="svg-parrent"></div>{{$t('distributeLocales.saveDistributionList')}}</button>
          </div>
          <form @submit.prevent="addCustomContact" class="width-all flex space-between align-center gap10 side-header-item">
            <p class="align-self-center">{{$t('distributeLocales.addCustomContact')}}</p>
            <FormInput class="flex-1" placeholder="distributeLocales.customEmailToAdd" v-model="customEmailToAdd"/>
            <!-- <button class="btn">{{$t('distributeLocales.add')}}</button> -->
            <button class="bold flex gap5 hover-pop">+<div v-html="svgs.person" class="svg-parrent"></div></button>
          </form>
          
          <div class="flex align-center space-between side-header-item">
            <p class="bold">{{contactsForDistribute.length}} {{$t('distributeLocales.contactsWasSelected')}}</p>
            <!-- <button class="btn" @click="copyUrlToClipboard">{{$t('distributeLocales.copyReleaseDistributionUrl')}} <img class="ico-img" :src="require('@/assets/images/icons/url.png')" alt=""></button> -->
            <ReleaseDistributionLinkCoppier :release="this.release" :organization="this.org"/>
          </div>
          <!-- <FormInput class="distribution-type width-all" :items="['email', 'sms']" label="distributeLocales.distributionType" type="radio" v-model="distributionType"/> -->
          
          <div class="table-like-list contacts-list flex-1 selected-table">
            <div class="table-item-preview selected-input gap10 table-header flex space-between align-center side-header-item">
              <!-- <p>{{$t('contactLocales.contactName')}}</p> -->
              <FormInput :placeholder="$t('search')" v-model="searchSelectedTerm"/>
              <!-- <button class="toggle-btn" @click="contactsForDistribute = []"><img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>{{$t('distributeLocales.removeAll')}}</button> -->
              <button class="toggle-btn_ flex gap10" @click="contactsForDistribute = []"><span>{{$t('distributeLocales.removeAll')}}</span><div class="toggle-btn bold hover-pop">-<div v-html="svgs.person" class="svg-parrent"></div></div></button>
            </div>
            <template v-if="contactsForDistributeToShow?.length">
              <div v-for="contact in contactsForDistributeToShow" :key="contact._id || contact.email || contact.mobile" class="table-item-preview gap10 flex align-center space-between" :class="{unsubscribed: contact.unsubscribed}">
                <p>{{contact.name || (contact.firstName && (contact.firstName + ' ' + (contact.lastName || ''))) || contact.email || contact.mobile || ''}}</p>
                <!-- <button class="toggle-btn" @click="toggleContact(contact)"><img :src="require('@/apps/megaphonApp/assets/images/remove_contact.svg')"/>{{$t('distributeLocales.remove')}}</button> -->
                <button class="toggle-btn bold hover-pop" @click="toggleContact(contact)">-<div v-html="svgs.person" class="svg-parrent"></div></button>
              </div>
            </template>
            <div v-else class="flex-1 flex justify-center align-center">
              <h3 class="clr-0">{{$t('distributeLocales.selectContacts')}}</h3>
            </div>
            <!-- <div class="item-list">
            </div> -->
          </div>
        </div>
      </div>
      <footer class="width-all flex align-center">
        <div class="flex align-center gap30">
          <router-link :to="{ name: 'ReleaseEdit', params: {organizationId, id: $route.params.id} }"><button class="">{{$t('back')}}</button></router-link>
          <div class="flex align-center justify-end gap10 full-screen-container height-all">
            <router-link v-if="isRoleInOrg('admin')" :to="{ name: 'ReleaseReport', params: {organizationId, id: $route.params.id} }"><button class="btn big">{{$t('distributeLocales.report')}}</button></router-link>
            <button class="btn big ignor-flex flex align-center gap15" @click="showDesign = true" ><div v-html="svgs.PreviewActions.eye" class="svg-parrent"></div><span>{{$t('releaseLocales.designAndPreview')}}</span></button>
            <button @click="sendTestEmail" class="btn big">{{$t('distributeLocales.sendTestMail')}}</button>
            <button @click="distribute()" class="btn big bg-4 clr-1 ignor-flex flex align-center gap15"><div v-html="svgs.PreviewActions.distribute" class="svg-parrent"></div><span>{{$t('distributeLocales.distribute')}}</span></button>
          </div>
        </div>
      </footer>

      <Modal :fullScreen="true" v-if="showMailingListSelectionModal" @close="showMailingListSelectionModal = false">
        <div class="flex column gap10 mailing-lists-modal mailing-list-list">
          <template v-if="emailLists?.length">
            <p>{{$t('distributeLocales.loadDistributionList')}}</p>
            <div class="table-like-list contacts-list flex-1 selected-table">
              <div class="table-item-preview gap10 table-header flex space-between">
                <p>{{$t('distributeLocales.mailingList')}}</p>
              </div>
              <div v-for="list in emailLists" :key="list._id" class="table-item-preview gap10 list-item flex align-center space-between " @click="selectMailingList(list)">
                <p>{{list.title}}</p>
                <button @click.stop="onRemoveMailingList(list)">✖</button>
              </div>
            </div>
          </template>
          <p v-else>{{$t('distributeLocales.noMailingListsFound')}}..</p>
          <div class="width-all flex justify-end">
            <button @click="showMailingListSelectionModal = false" class="btn">{{$t('close')}}</button>
          </div>
        </div>
      </Modal>
      <Modal :fullScreen="true" v-else-if="showAddMailingListItemModal" @close="showAddMailingListItemModal = false">
        <div class="flex column gap10 new-lists-modal">
          <template v-if="contactsForDistribute?.length">
            <p>{{$t('distributeLocales.saveDistributionList')}}</p>
            <form @submit.prevent="createMailingList" class="flex space-between gap10">
              <FormInput v-model="newMailingListName" placeholder="name"/>
              <button class="btn">{{$t('create')}}</button>
            </form>
            <div class="table-like-list contacts-list flex-1 selected-table mailing-list-list">
              <div v-for="list in emailLists" :key="list._id" class="table-item-preview gap10 list-item flex align-center space-between" @click="updateMailingList(list)">
                <p>{{list.title}}</p>
              </div>
            </div>
          </template>
          <p v-else>{{$t('distributeLocales.cantCreateEmptyMailingList')}}..</p>
          <div class="width-all flex justify-end">
            <button @click="showAddMailingListItemModal = false" class="btn">{{$t('close')}}</button>
          </div>
        </div>
      </Modal>
      <Modal :fullScreen="true" v-else-if="showDistributionReportModal && distributionReport">
        <div class="flex column gap30 distribution-report-modal">
          <div class="flex space-between">
            <p>{{$t('distributeLocales.sccessfullyDistributedReleaseTo')}} <span class="ltr">{{distributionReport.sentToContacts.length}}/{{(distributionReport.sentToContacts?.length || 0) + (distributionReport.faildSendToContacts?.length || 0) + (distributionReport.allreadyDistributedTo?.length || 0) + (distributionReport.unsubscribedContacts?.length || 0) + (distributionReport.missingDataContacts?.length || 0)}}</span> {{$t('contactLocales.contacts')}}.</p>
            <button @click="showDistributionReportModal = false" class="btn">{{$t('close')}}</button>
          </div>
          <div class="flex column gap20 distribution-report-modal-content">
            <div class="flex column gap10" v-if="distributionReport.faildSendToContacts?.length">
              <p>{{$t('distributeLocales.cantSenDistributionTo')}} {{distributionReport.faildSendToContacts.length}} {{$t('contactLocales.contacts')}}:</p>
              <ContactList :contacts="distributionReport.faildSendToContacts" :fields="[{label: $t('contactLocales.contactName'), field: 'name'}, {label: 'email', field: 'email'}, {label: 'mobile', field: 'mobile'}]"/>
              <div><button class="btn big primary" @click="tryDistributeAgain">{{$t('distributeLocales.tryAgain')}}</button></div>
            </div>
            <div class="flex column gap10" v-if="distributionReport.missingDataContacts?.length">
              <p>{{$t('distributeLocales.missingEmailOrMobile')}} {{distributionReport.missingDataContacts.length}} {{$t('contactLocales.contacts')}}:</p>
              <ContactList :contacts="distributionReport.missingDataContacts" :fields="[{label: $t('contactLocales.contactName'), field: 'name'}, {label: 'email', field: 'email'}, {label: 'mobile', field: 'mobile'}]"/>
            </div>
            <div class="flex column gap10" v-if="distributionReport.allreadyDistributedTo?.length">
              <p>{{$t('distributeLocales.alreadyDistributedToContacts')}} {{distributionReport.allreadyDistributedTo.length}} {{$t('contactLocales.contacts')}}:</p>
              <ContactList :contacts="distributionReport.allreadyDistributedTo" :fields="[{label: $t('contactLocales.contactName'), field: 'name'}, {label: 'email', field: 'email'}, {label: 'mobile', field: 'mobile'}]"/>
            </div>
            <div class="flex column gap10" v-if="distributionReport.unsubscribedContacts?.length">
              <p>{{$t('distributeLocales.unsubscribedContacts')}} {{distributionReport.unsubscribedContacts.length}} {{$t('contactLocales.contacts')}}:</p>
              <ContactList :contacts="distributionReport.unsubscribedContacts" :fields="[{label: $t('contactLocales.contactName'), field: 'name'}, {label: 'email', field: 'email'}, {label: 'mobile', field: 'mobile'}]"/>
            </div>
            <!-- <div class="width-all flex justify-end">
              <button @click="showDistributionReportModal = false" class="btn">{{$t('close')}}</button>
            </div> -->
          </div>
        </div>
      </Modal>
      <ReleaseDesignViewer
        @close="showDesign = false"
        v-if="showDesign"
        :release="release"
        :organization="org"
      />
    </template>
    <Loader :fullScreen="true" v-if="isLoading" 
      :msg="isLoadingForDist? `
        <div class='flex column align-center'>
          <p>${$t('distributeLocales.loadingMsg')}</p>
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
import { mailingListService } from '../services/mailingList.service.js';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import Modal from '@/apps/common/modules/common/cmps/Modal.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import { Utils } from '../../../../common/modules/common/services/util.service';
import ReleaseDistributionLinkCoppier from '../cmps/ReleaseDistributionLinkCoppier.vue';
import ContactList from '../../contact/cmps/ContactList.vue';
import { organizationService } from '../../organization/services/organization.service';

import config from '@/config';
import { getSvgs } from '../../../assets/images/svgs';
import ReleaseDesignViewer from '../cmps/ReleaseDesignViewer.vue';

const minimizeContact = ({_id, email, unsubscribed, name, mobile}) => ({_id, email, unsubscribed, name, mobile});

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
      testMode: false,
      distributionType: 'email',

      customEmailToAdd: '',

      emailLists: [],
      isLoadingLocal: false,
      showMailingListSelectionModal: false,

      showAddMailingListItemModal: false,
      newMailingListName: '',

      distributionReport: null,
      showDistributionReportModal: false,

      searchSelectedTerm: '',
      isLoadingForDist: false,

      sendingToStatus: {
        total: 0,
        sent: 0,
      },

      
      showDesign: false
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
      return templateUtils.getReleaseRelevantTemplateItem?.(this.release, this.org, 'email') || null;
    },

    contactsForDistributeToShow() {
      if (!this.searchSelectedTerm) return this.contactsForDistribute;
      return this.contactsForDistribute.filter(c => {
        return c.name?.toLowerCase?.().includes(this.searchSelectedTerm.toLowerCase()) || c.email?.toLowerCase?.().includes(this.searchSelectedTerm.toLowerCase()) || c.mobile?.toLowerCase?.().includes(this.searchSelectedTerm.toLowerCase());
      })
    },

    sendInEmailUrl() {
      // &token=${Utils.getRandomId('')}
      return templateUtils.getReleaseLandingPageUrl(this.release, this.org, 'landingPage', config, window.location.pathname) + `?releaseId=${this.release?._id}&origin=email&token=`;
    },

    
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },


    svgs() {
      return getSvgs();
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
    //   Utils.copyToClipBoard(this.sendInEmailUrl);
    //   alertService.toast({ msg: this.$t(`copiedToClipboard`), type: 'safe' });
    // },
    async getItem() {
      this.release = await this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id, organizationId: this.organizationId });
    },
    async getOrg() {
      this.org = await this.$store.dispatch({ type: 'organization/loadItem', id: this.organizationId });
      if (this.org?.dontUseGlobalDbData) this.loadSystemContacts = false;
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

    compareContacts(con1, con2) {
      let areTheSame = false;
      if (con1.email) areTheSame = con1.email === con2.email;
      if (con1.mobile) areTheSame = con1.mobile === con2.mobile;
      return areTheSame;
    },

    addContact(contact) {
      if (!(contact?.email || contact?.mobile)) return;
      if (contact.email) contact.email = contact.email.trim().toLowerCase();
      if (contact.mobile) contact.mobile = contact.mobile.trim().toLowerCase();
      const idx = this.contactsForDistribute.findIndex(c => this.compareContacts(c, contact));
      if (idx === -1) this.contactsForDistribute.unshift(contact);
    },
    toggleContact(contact) {
      const idx = this.contactsForDistribute.findIndex(c => this.compareContacts(c, contact));
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
        alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.cantAddContacts`) });
      }
      this.isLoadingLocal = false;
    },
    addCustomContact() {
      if (!this.customEmailToAdd) return;
      const newContact = { name: this.customEmailToAdd, [this.distributionType === 'email'? 'email' : 'mobile']: this.customEmailToAdd };
      this.addContact(newContact);
      this.customEmailToAdd = ''; // TODO:: doesnt work;;
    },


    async distribute(contacts) {
      const isToSend = await alertService.Confirm(this.$t('distributeLocales.distributeReleaseConfirmMsg'));
      if (!isToSend) return;
      try {
        const actualContacts = contacts || this.contactsForDistribute;
        this.sendingToStatus.total = actualContacts.length;
        this.sendingToStatus.sent = 0;
        this.isLoadingLocal = true;
        this.isLoadingForDist = true;
        const res = await distributionService.distribute(this.organizationId, this.release._id, { 
          from: this.fromEmail,
          contacts: actualContacts.map(minimizeContact),
          forceDistribute: this.isForceDistribute,
          distributionType: this.distributionType,
          testMode: this.testMode,
        }, updatedSentToCount => this.sendingToStatus.sent = updatedSentToCount);
        // alertService.toast({ msg: `Successfully distributed release to ${res.sentToContacts.length} out of ${this.contactsForDistribute.length} contacts` });
        // alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.successDistRelease`), type: 'safe' });
        console.log(res);
        this.distributionReport = res;
        this.showDistributionReportModal = true;
      } catch(err) {
        alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.errorDistRelease`) });
      }
      this.sendingToStatus.total = 0;
      this.sendingToStatus.sent = 0;
      this.isLoadingLocal = false;
      this.isLoadingForDist = false;
    },
    async sendTestEmail() {
      const testEmail = await alertService.Prompt(this.$t('distributeLocales.testEmail'), this.$t('distributeLocales.testEmail'), localStorage.testEmailVal);
      if (!testEmail) return;
      localStorage.testEmailVal = testEmail;
      this.isLoadingLocal = true;
      try {
        const res = await distributionService.testDistribute(this.organizationId, this.release._id, { 
          from: this.fromEmail,
          contacts: [{ email: testEmail }]
        });
        this.distributionReport = res;
        this.showDistributionReportModal = true;
        // alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.testDistSentSuccess`), type: 'safe' });
      } catch(err) {
        alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.testDistSentError`) });
      }
      this.isLoadingLocal = false;
    },

    async tryDistributeAgain() {
      this.distribute(this.distributionReport.faildSendToContacts);
    },


    async getMailingLists() {
      const listsData = await mailingListService.queryMailingLists(this.organizationId);
      this.emailLists = listsData.items;
      // this.isLoadingLocal = true;
      // try {
      //   const listsData = await mailingListService.queryMailingLists(this.organizationId);
      //   this.emailLists = listsData.items;
      //   this.showMailingListSelectionModal = true;
      // } catch(err) {
      //   alertService.toast({ msg: `Somethind went wrong, cant load mailing lists` });
      // }
      // this.isLoadingLocal = false;
    },
    selectMailingList(list) {
      // this.contactsForDistribute = [
      //   ...this.contactsForDistribute,
      //   ...list.contacts
      //     // .filter(c => !c.unsubscribed)
      //     .filter(c => !this.contactsForDistribute.find(_ => _.email === c.email))
      // ];
      list.contacts.forEach(this.addContact);
      this.showMailingListSelectionModal = false;
    },

    async createMailingList() {
      if (!this.newMailingListName) {
        alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.noMailingListNameError`) })
        return;
      }
      this.isLoadingLocal = true;
      try {
        const newListItem = {
          contacts: this.contactsForDistribute.map(minimizeContact),
          title: this.newMailingListName,
          organizationId: this.organizationId
        }
        await mailingListService.addMailingList(this.organizationId, newListItem);
        this.newMailingListName = '';
        this.showAddMailingListItemModal = false;
      } catch(err) {
        alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.createMailingListError`) });
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
        await mailingListService.updateMailingList(this.organizationId, newListItem);
        this.newMailingListName = '';
        this.showAddMailingListItemModal = false;
      } catch(err) {
        alertService.toast({ msg: this.$t(`distributeLocales.alertMsgs.updateMailingListError`) });
      }
      this.isLoadingLocal = false;
      this.getMailingLists();
    },
    async onRemoveMailingList(list) {
      if (!await alertService.Confirm(this.$t('distributeLocales.alertMsgs.confirmRemovemailingListMsg'))) return;
      this.isLoadingLocal = true;
      await mailingListService.removeMailingList(this.organizationId, list._id);
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
    ReleaseDesignViewer,
  },


}
</script>


<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme.megaphon-app { // MOVED TO
//   .release-distribute {
//     .add-all-btn-img {
//       &.reg { display: none; }
//       &.dark { display: unset; }
//     }
//   }
//   // .selected-input {
//   //   input {
//   //     color: black !important;
//   //   }
//   // }
// }
.megaphon-app {
  .release-distribute {
    // --headingBg: var(--clr-3);
    // --headingClr: var(--clr-0);
    // --mainBgForBorder: var(--clr-1);
    // --mainBg: var(--clr-1);
    --headingBg: #E0E0E0;
    --headingClr: black;
    --mainBgForBorder: black;
    --mainBg: white;
    padding-top: em(10px);

    .main-content {
      @media (max-width: $small-screen-break) {
        flex-direction: column-reverse;
        gap: em(50px);
        .distribute-detailes {
          border-bottom: 1px solid var(--clr-0);
          padding-bottom: em(50px);
        }
      }

      .side-pre-header-item {
        min-height: rem(18px);
        padding: 0;
        margin-bottom: rem(10px);
      }
      // .filter-container {
      //   .ToggleModalOnlyForSmallScreen {
      //     width: 100%;
      //   }
      // }
      .side-header-item, .filter-container, .table-header {
        color: var(--headingClr);
        background-color: var(--headingBg);
        // color: black;
        // background-color: #E0E0E0;
        // border-bottom: rem(1.5px) solid rgba(0, 0, 0, 0.2);
        // $clr: var(--headingClr);
        border-bottom: rem(1.5px) solid color-mix(in srgb, var(--mainBgForBorder) 30%, transparent);
        min-height: rem(40px);
        padding: rem(5px) rem(5px);
        padding-inline-end: rem(10px);
        padding-inline-start: rem(10px);
        align-items: center;
        .input, input, .actual-input {
          // background-color: var(--clr-1);
          color: var(--headingClr) !important;
          background-color: var(--mainBg) !important;
          &.multiselect {
            background-color: unset !important;
            .head {
              background-color: unset !important;
            }
          }
        }
      }
      // .filter-container {
      //   height: fit-content !important;
      // }
      // .filter-container form {
      //   border-bottom: unset !important;
      //   padding: 0 !important;
      // }
      .item-list {
        box-shadow: unset;
      }
      .pagination-btns {
        margin-top: rem(10px);
      }

      .item-page {
        gap: 0 !important;
        .filter-container {
          // padding: 0;
          // form {
          //   align-items: center;
          // }
        }
        .table-header {
          >*:not(:last-child) {
            border-inline-end: em(2px) solid color-mix(in srgb, var(--mainBgForBorder) 30%, transparent);
          }
        }
      }
    }

    footer {
      // position: fixed; 
      width: 100%;
      bottom: 0;
      left: 0;
      height: em(70px);
      background-color: var(--headingBg);
      

      @media (min-width: $small-screen-break) {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        // width: 50%;
        width: unset;
        background-color: unset;
        height: $header-height
      }
    }

    .selected-input {
      input {
        color: var(--clr-1);
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
      // font-size: em(15px);
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

    .force-distribution {
      
    }
    .distribution-type {
      .options-container {
        flex-direction: row;
      }
    }

    .contacts-selection-list {
      .table-item-preview {
        >* {
          &:last-child {
            // max-width: em(100px);
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>
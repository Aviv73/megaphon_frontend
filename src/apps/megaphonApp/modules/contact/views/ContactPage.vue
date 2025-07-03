<template>
  <section class="contact-page flex column gap10 width-all">
    <h2 class="inner-page-sub-header">{{$t('contactLocales.contacts')}}</h2>
    <ItemSearchList
      class="height-all table-like-list"
      :itemsData="allContactData"
      :initFilterBy="filterBy"
      @filter="getAllContacts"
      itemDetailesPageName="ContactDetails"
      newItemPageName="ContactEdit"
      :singlePreviewCmp="ContactPreview"
      :filterByCmp="ContactFilter"
      :showActions="false"
      :dontRoute="true"
      :isLoading="isLoading"
      :showLoader="false"
      :propsToPass="{
        fields: isScreenWide? undefined : ['name', 'unsubscribed']
      }"
      layoutMode="flex"
    >

      <template v-slot:filterActions>
        <div class="flex align-center gap20">
          <router-link :to="{name: 'ContactEdit', params: { organizationId: $route.params.organizationId } }"><button class="flex align-center gap10"><span class="flex align-center bold">+<div v-html="svgs.person" class="svg-parrent"></div></span><span>{{$t('addNew')}}</span></button></router-link>
          <div class="flex align-center gap10 justify-end">
            <div v-html="svgs.loadCloud" class="svg-parrent"></div>
            <FormInput
              type="file"
              accept=".xlsx, .xls, .xl, .csv"
              @change="uploadContactsFromFile"
              v-model="contactsFiles"
              placeholder="contactLocales.loadXlFile"
            />
            <Tooltip :msg_="$t('contactLocales.uploadFileTooltipMsg')">
              <template v-slot:content>
                <div class="flex gap10 column">
                  <p v-html="$t('contactLocales.uploadFileTooltipMsg').split('\n').join('<br/>')"></p>
                  <a class="clr-4" href="/files/emptyContactsFileToFill.xlsx" download="contacts for megaphon.xlsx">{{$t('contactLocales.downloadEmtyFileToFill')}}</a>
                </div>
              </template>
            </Tooltip>
          </div>
        </div>
      </template>
      <template v-slot:listHeader>
        <!-- <div class="actions">
          
        </div> -->

        <div class="table-item-preview table-header">
          <p class="wide-screen-item">{{$t('email')}}</p>
          <p>{{$t('contactLocales.contactName')}}</p>
          <p class="wide-screen-item">{{$t('contactLocales.tags')}}</p>
          <p class="wide-screen-item">{{$t('contactLocales.companyName')}}</p>
          <p>{{$t('contactLocales.unsubscribed')}}</p>
        </div>
      </template>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import ContactPreview from '../cmps/ContactPreview.vue';
import ContactFilter from '../cmps/ContactFilter.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';

import { httpService } from '@/apps/common/modules/common/services/http.service';
import Tooltip from '../../../../common/modules/common/cmps/Tooltip.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import { getSvgs } from '../../../assets/images/svgs';

export default {
  name: 'ContactPage',
  data() {
    return {
      ContactPreview,
      ContactFilter,
      contactsFiles: null
    }
  },
  methods: {
    getAllContacts(filterBy) {
      this.$store.dispatch({ type: 'contact/loadItems', filterBy: {...filterBy, includeUnsubscribed: true}, organizationId: this.$route.params.organizationId });
    },
    async uploadContactsFromFile(files) {
      if (!files?.length) return;
      if (!await alertService.Confirm(this.$t('contactLocales.alerts.confirmUploadContactsFileMsg'))) {
        this.contactsFiles = null;
        return;
      }
      const mailingListName = await alertService.Prompt(this.$t('contactLocales.alerts.saveAsMailingListPromptMsg'), this.$t('name'));
      this.$store.commit({type: 'contact/setProp', key: 'isLoading', value: true});
      try {
        const data = new FormData();
        data.append('file', files[0]);
        await httpService.post(`file/uploadContacts/${this.organizationId}`, data, { mailingListName });
        alertService.toast({type: 'safe', msg: this.$t('contactLocales.alerts.uploadedContactsSuccessfully')});
      } catch(err) {
        alertService.toast({type: 'danger', msg: this.$t('contactLocales.alerts.cantUploadContactsError')});
      }
      this.contactsFiles = null;
      this.$store.commit({type: 'contact/setProp', key: 'isLoading', value: false});
      this.getAllContacts();
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
      return this.$store.getters['contact/isLoading'];
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },

    svgs() {
      return getSvgs();
    }
  },
  watch: {
    organizationId() {
      this.getAllContacts();
    }
  },
  components: { ItemSearchList, Loader, ContactPreview, ContactFilter, FormInput, Tooltip }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .contact-page {
    padding: em(20px) 0;
    height: auto;
    .actions {
      // text-align: end;
      margin-bottom: em(20px);
    }

    
    .filter-container {
      padding: em(10px);
      background-color: var(--clr-3);
    }
    .file-btn {
      text-decoration: unset !important;
    }
    // background-color: #E0E0E0;
  }
}
</style>
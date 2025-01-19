<template>
  <section class="contact-page flex column gap10 width-all">
    <h2>{{$t('contactLocales.contacts')}}</h2>
    <ItemSearchList
      class="height-all table-like-list"
      :itemsData="allContactData"
      :initFilterBy="filterBy"
      @filter="getAllRContacts"
      itemDetailesPageName="ContactDetails"
      newItemPageName="ContactEdit"
      :singlePreviewCmp="ContactPreview"
      :filterByCmp="ContactFilter"
      :showActions="true"
      :dontRoute="true"
      :isLoading="isLoading"
      :showLoader="false"
      :propsToPass="{
        fields: isScreenWide? undefined : ['name', 'unsubscribed']
      }"
      layoutMode="flex"
    >
      <div class="actions">
        <div class="flex align-center gap10 justify-end">
          <Tooltip :msg_="$t('contactLocales.uploadFileTooltipMsg')">
            <template v-slot:content>
              <p v-html="$t('contactLocales.uploadFileTooltipMsg').split('\n').join('<br/>')"></p>
            </template>
          </Tooltip>
          <FormInput
            type="file"
            accept=".xlsx, .xls, .xl, .csv"
            @change="uploadContactsFromFile"
            v-model="contactsFiles"
            placeholder="contactLocales.uploadFromFile"
          />
        </div>
      </div>

      <div class="table-item-preview table-header">
        <p class="wide-screen-item">{{$t('email')}}</p>
        <p>{{$t('contactLocales.contactName')}}</p>
        <p class="wide-screen-item">{{$t('contactLocales.role')}}</p>
        <p class="wide-screen-item">{{$t('contactLocales.companyName')}}</p>
        <p>{{$t('contactLocales.unsubscribed')}}</p>
      </div>
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
    getAllRContacts(filterBy) {
      this.$store.dispatch({ type: 'contact/loadItems', filterBy: {...filterBy, includeUnsubscribed: true}, organizationId: this.$route.params.organizationId });
    },
    async uploadContactsFromFile(files) {
      // TODO: GET MILING LIST NAME AND SAVE A MAILING LIST WITH NEW CONTACTS;
      this.$store.commit({type: 'contact/setProp', key: 'isLoading', value: true});
      const data = new FormData();
      data.append('file', files[0]);
      await httpService.post(`file/uploadContacts/${this.organizationId}`, data);
      this.contactsFiles = null;
      this.$store.commit({type: 'contact/setProp', key: 'isLoading', value: false});
      this.getAllRContacts();
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
    }
  },
  watch: {
    organizationId() {
      this.getAllRContacts();
    }
  },
  components: { ItemSearchList, Loader, ContactPreview, ContactFilter, FormInput, Tooltip }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .contact-page {
    padding: em(10px) 0;
    height: auto;
    .actions {
      // text-align: end;
      margin-bottom: em(20px);
    }
    // background-color: #E0E0E0;
  }
}
</style>
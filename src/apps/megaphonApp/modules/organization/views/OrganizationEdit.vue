<template>
  <div v-if="organizationToEdit" class="organization-edit app-form-styling simple-form flex column gap40 width-all">
    <h2 v-if="organizationToEdit._id">{{$t('organization.editOrganization')}}</h2>
    <h2 v-else>{{$t('organization.createOrganization')}}</h2>
    <form v-if="organizationToEdit" @submit.prevent="" class="flex column width-all gap50">
      <div class="input-container">
        <p>{{$t('organization.name')}}</p>
        <FormInput type="text" placeholder="organization.name" v-model="organizationToEdit.name"/>
      </div>
      <div class="flex column gap20">
        <p>{{$t('organization.logo')}}</p>
        <FileUploader :viewAsImg="true" :value="{src: organizationToEdit.logoUrl}" @input="val => imgUploaded(val, 'logoUrl')"/>
      </div>

      <div class="from-emails-section flex column gap20 align-start">
        <p>{{$t('organization.fromEmails')}}</p>
        <ul class="emails flex column gap10 table-like">
          <li>
            <p>{{$t('email')}}</p>
            <p>{{$t('name')}}</p>
            <p>{{$t('distribute.allowReply')}}</p>
            <p></p>
          </li>
          <li v-for="(curr, idx) in organizationToEdit.fromEmails || []" :key="idx">
            <FormInput type="text" placeholder="name" v-model="curr.email"/>
            <FormInput type="text" placeholder="name" v-model="curr.title"/>
            <FormInput type="checkbox" placeholder="distribute.allowReply" v-model="curr.allowReply"/>
            <TableActionBtns v-model="organizationToEdit.fromEmails" :idx="idx"/>
          </li>
        </ul>
        <button @click="addFromEmailItem" class="btn big">{{$t('add')}}</button>
      </div>

      <div class="flex column gap20">
        <div class="input-container">
          <p>{{$t('organization.defaultGalleryCredit')}}</p>
          <FormInput type="text" placeholder="organization.defaultGalleryCredit" v-model="organizationToEdit.defaultGalleryCredit"/>
        </div>
        <div class="input-container">
          <p>{{$t('organization.distributionBcc')}}</p>
          <FormInput type="text" placeholder="organization.distributionBcc" v-model="organizationToEdit.distributionBcc"/>
        </div>
      </div>

      
      <div class="logos-section flex column gap20 align-start">
        <p>{{$t('organization.logos')}}</p>
        <ul class="flex column gap10 table-like">
          <li>
            <p>{{$t('name')}}</p>
            <p>{{$t('file')}}</p>
            <p></p>
          </li>
          <li v-for="(curr, idx) in organizationToEdit.logos || []" :key="idx">
            <FormInput type="text" placeholder="name" v-model="curr.title"/>
            <FileUploader :onlySrc="true" :viewAsImg="true" :value="curr.url" @input="val => imgUploaded(val, `logos.${idx}.url`)"/>
            <TableActionBtns v-model="organizationToEdit.logos" :idx="idx"/>
          </li>
        </ul>
        <button @click="addLogoItem" class="btn big">{{$t('add')}}</button>
      </div>


      <h2 @click="showDeveloperZone = !showDeveloperZone">DEVELOPER ZONE</h2>
      

      <div class="developer-zone" v-if="showDeveloperZone">
        <div class="flex column gap20 align-start">
          <p>{{$t('organization.designPreferences')}}</p>
          <div class="input-container">
            <p>{{$t('organization.color')}}</p>
            <FormInput type="color" placeholder="organization.color" v-model="organizationToEdit.designPreferences.color"/>
          </div>
          <div class="input-container">
            <p>{{$t('organization.bgColor')}}</p>
            <FormInput type="color" placeholder="organization.bgColor" v-model="organizationToEdit.designPreferences.bgColor"/>
          </div>
        </div>

        <div class="route-filters-section flex column gap20 align-start">
          <p>{{$t('organization.routes')}}</p>
          <ul class="flex column gap10 table-like">
            <li>
              <p>{{$t('title')}}</p>
              <p>{{$t('releaseTypes')}}</p>
              <p>{{$t('wasDistributed')}}</p>
              <p>{{$t('htmlContentFilePath')}}</p>
              <p>{{$t('showInClient')}}</p>
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.routes || []" :key="idx">
              <FormInput type="text" placeholder="title" v-model="curr.title"/>
              <FormInput type="multiselect" :items="organizationToEdit.releaseTypes.map(({id, name}) => ({value: id, label: name}))" placeholder="releaseTypes" v-model="curr.releaseFilter.releaseTypes"/>
              <FormInput type="select" :itemsMap="{undefined:undefined, true:true,false:false}" placeholder="wasDistributed" v-model="curr.releaseFilter.wasDistributed"/>
              <FormInput type="text" placeholder="htmlContentFilePath" v-model="curr.htmlContentFilePath"/>
              <FormInput type="checkbox" v-model="curr.showInClient"/>
              <TableActionBtns v-model="organizationToEdit.routes" :idx="idx"/>
            </li>
          </ul>
          <button @click="addRouteFilterItem" class="btn big">{{$t('add')}}</button>
        </div>

        <div class="inner-filters-section flex column gap20 align-start">
          <p>{{$t('organization.innerFilters')}}</p>
          <ul class="flex column gap10 table-like">
            <li>
              <p>{{$t('field')}}</p>
              <p>{{$t('title')}}</p>
              <p>{{$t('options')}}</p>
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.innerFilters || []" :key="idx">
              <FormInput type="text" placeholder="field" v-model="curr.field"/>
              <FormInput type="text" placeholder="title" v-model="curr.title"/>
              <FormInput type="text" placeholder="options" v-model="curr.options"/>
              <TableActionBtns v-model="organizationToEdit.innerFilters" :idx="idx"/>
            </li>
          </ul>
          <button @click="addInnerFilterItem" class="btn big">{{$t('add')}}</button>
        </div>

        <div class="release-types-section flex column gap20 align-start">
          <p>{{$t('organization.releaseTypes')}}</p>
          <ul class="flex column gap10 table-like">
            <li>
              <p>{{$t('id')}}</p>
              <p>{{$t('name')}}</p>
              <p>{{$t('dataFieldsLocalFilePath')}}</p>
              <p>{{$t('isGroup')}}</p>
              <!-- <p>{{$t('dataFieldsStr')}}</p> -->
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.releaseTypes || []" :key="idx">
              <FormInput type="autocomplete" placeholder="id" v-model="curr.id" :items="['DEFAULT_SIMPLE', 'DEFAULT_GROUP']"/>
              <FormInput type="text" placeholder="name" v-model="curr.name"/>
              <FormInput type="text" placeholder="dataFieldsFilePath" v-model="curr.dataFieldsLocalFilePath"/>
              <FormInput type="checkbox" v-model="curr.isGroup"/>
              <!-- <FormInput type="textarea" placeholder="dataFieldsStr" v-model="curr.dataFieldsStr"/> -->
              <TableActionBtns v-model="organizationToEdit.releaseTypes" :idx="idx"/>
            </li>
          </ul>
          <button @click="addReleaseTypeItem" class="btn big">{{$t('add')}}</button>
        </div>
        
        <div class="templates-section flex column gap20 align-start">
          <p>{{$t('organization.templates')}}</p>
          <ul class="flex column gap10 table-like">
            <li>
              <p>{{$t('name')}}</p>
              <p>{{$t('url')}}</p>
              <!-- <p>{{$t('previewUrl')}}</p> -->
              <p>{{$t('templateType')}}</p>
              <p>{{$t('releaseTypes')}}</p>
              <p>{{$t('hadlebarsFilePath')}}</p>
              <p>{{$t('appName')}}</p>
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.templates || []" :key="idx">
              <FormInput type="text" placeholder="name" v-model="curr.name"/>
              <FormInput type="text" placeholder="url" v-model="curr.url"/>
              <!-- <FormInput type="text" placeholder="previewUrl" v-model="curr.previewUrl"/> -->
              <FormInput type="select" :itemsMap="{landingPage: '0', newsLetter: '1'}" placeholder="templateType" v-model="curr.type"/>
              <FormInput type="multiselect" :items="organizationToEdit.releaseTypes.map(({id, name}) => ({value: id, label: name}))" placeholder="releaseTypes" v-model="curr.releaseTypes"/>
              <FormInput type="text" placeholder="hadlebarsFilePath" v-model="curr.handlebarsLocalFilePath"/>
              <FormInput type="text" placeholder="appName" v-model="curr.appName"/>

              <!-- <FormInput type="textarea" placeholder="hadlebarsFileStr" v-model="curr.hadlebarsFileStr"/> -->
              <TableActionBtns v-model="organizationToEdit.templates" :idx="idx"/>
            </li>
          </ul>
          <button @click="addTemplateItem" class="btn big">{{$t('add')}}</button>
        </div>
      </div>
    </form>
    <div class="flex gap10">
      <button class="btn big primary" @click="saveOrganization" :disabled="!isOrganizationValid">{{$t('submit')}}</button>
      <button class="btn big" @click="close">{{$t('cancel')}}</button>
    </div>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
// import ImgInput from '@/apps/common/modules/common/cmps/ImgInput.vue'
// import { uploadImg } from '../../common/services/util.service'
import { getRandomId, setDeepVal } from '../../../../common/modules/common/services/util.service'
import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import TableActionBtns from '../../../../common/modules/common/cmps/TableActionBtns.vue';
export default {
  name: 'OrganizationEdit',
  data() {
    return {
      organizationToEdit: null,
      showDeveloperZone: false
    }
  },
  computed: {
    isOrganizationValid() {
      const item = this.organizationToEdit;
      return !!item;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
  },
  methods: {
    async getOrganization() {
      this.organizationToEdit = await this.$store.dispatch({ type: 'organization/loadItem', id: this.$route.params.id });
    },
    async saveOrganization() {
      if (!this.isOrganizationValid) return;
      await this.$store.dispatch({ type: 'organization/saveItem', item: this.organizationToEdit });
      this.close();
    },
    close() {
      this.$router.push({ name: 'OrganizationPage', params: { organizationId: this.$route.params.organizationId } })
    },

    async imgUploaded(imgData, pathToSet) {
      // const uploadedImg = await imgUploaded(imgData);
      setDeepVal(this.organizationToEdit, pathToSet, imgData.src);
    },


    addFromEmailItem() {
      if (!this.organizationToEdit.fromEmails) this.organizationToEdit.fromEmails = [];
      this.organizationToEdit.fromEmails.push({ title: '', email: '' });
    },
    addRouteFilterItem() {
      if (!this.organizationToEdit.routes) this.organizationToEdit.routes = [];
      this.organizationToEdit.routes.push({ title: '', releaseFilter: {releaseTypes: [], wasDistributed: undefined}, id: getRandomId(), showInClient: false, htmlContentFilePath: '' });
    },
    addInnerFilterItem() {
      if (!this.organizationToEdit.innerFilters) this.organizationToEdit.innerFilters = [];
      this.organizationToEdit.innerFilters.push({ field: '', title: '', options: [], id: getRandomId() });
    },
    addReleaseTypeItem() {
      if (!this.organizationToEdit.releaseTypes) this.organizationToEdit.releaseTypes = [];
      this.organizationToEdit.releaseTypes.push({ name: '', id: getRandomId(), /* fileUrl: '', */ dataFieldsStr: '', isGroup: false });
    },
    addTemplateItem() {
      if (!this.organizationToEdit.templates) this.organizationToEdit.templates = [];
      this.organizationToEdit.templates.push( { name: '', type: '' /*'0'/'1'*/ , releaseTypes: [/*releaseTypesIds*/], url: '', previewUrl: '', id: getRandomId(), handlebarsLocalFilePath: '' });
    },
    addLogoItem() {
      if (!this.organizationToEdit.logos) this.organizationToEdit.logos = [];
      this.organizationToEdit.logos.push({url: '', id: getRandomId(), title: ''});
    },
  },
  created() {
    this.getOrganization();
  },
  watch: {
    '$route.params.id'() {
      this.getOrganization();
    }
  },
  components: {
    FormInput,
    // ImgInput,
    FileUploader,
    TableActionBtns
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .organization-edit {
    form, .developer-zone {
      >* {
        width: 100%;
        padding-bottom: em(10px);
        border-bottom: em(1px) solid black;
      }
    }
    .table-like {
      // width: 100%;
      li {
        width: 100%;
        // display: grid;
        // grid-template-columns: auto;
        // gap: em(10px);
        display: flex;
        align-items: flex-start;
        gap: em(10px);

        width: 100%;
        >* {
          flex: 1;
          width: 200px;
          &:last-child {
            flex: unset;
            width: 100px;
          }
        }
      }
    }

    .logos-section {
      li {
        display: flex;
        align-items: flex-start;
        gap: em(10px);
        width: 100%;
        >* {
          flex: unset;
        }
        >:first-child {
          width: 200px;
          // &:last-child {
          //   flex: unset;
          // }
        }
      }
    }

    .input-container {
      display: flex;
      align-items: center;
      >p {
        width: em(200px);
      }
      .form-input {
        flex: 1;
      }
    }
  }
}
</style>
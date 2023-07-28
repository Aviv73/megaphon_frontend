<template>
  <div v-if="organizationToEdit" class="organization-edit simple-form flex column gap40 width-all">
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
            <p></p>
          </li>
          <li v-for="(curr, idx) in organizationToEdit.fromEmails || []" :key="idx">
            <FormInput type="text" placeholder="name" v-model="curr.email"/>
            <FormInput type="text" placeholder="name" v-model="curr.title"/>
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
        <ul class="emails flex column gap10 table-like">
          <li>
            <p>{{$t('name')}}</p>
            <p>{{$t('file')}}</p>
            <p></p>
          </li>
          <li v-for="(curr, idx) in organizationToEdit.logos || []" :key="idx">
            <FormInput type="text" placeholder="name" v-model="curr.title"/>
            <FileUploader :viewAsImg="true" :value="{src: curr.url}" @input="val => imgUploaded(val, `logos.${idx}.url`)"/>
            <TableActionBtns v-model="organizationToEdit.logos" :idx="idx"/>
          </li>
        </ul>
        <button @click="addLogoItem" class="btn big">{{$t('add')}}</button>
      </div>

      <h2 @click="showDeveloperZone = !showDeveloperZone">DEVELOPER ZONE</h2>
      <div class="developer-zone" v-if="showDeveloperZone">
        <div class="filters-section flex column gap20 align-start">
          <p>{{$t('organization.filters')}}</p>
          <ul class="emails flex column gap10 table-like">
            <li>
              <p>{{$t('title')}}</p>
              <p>{{$t('releaseTypes')}}</p>
              <p>{{$t('wasDistributed')}}</p>
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.filters || []" :key="idx">
              <FormInput type="text" placeholder="title" v-model="curr.title"/>
              <FormInput type="multiselect" :items="organizationToEdit.releaseTypes.map(({_id, name}) => ({value: _id, label: name}))" placeholder="releaseTypes" v-model="curr.releaseTypes"/>
              <FormInput type="select" :itemsMap="{undefined:undefined, true:true,false:false}" placeholder="wasDistributed" v-model="curr.wasDistributed"/>
              <TableActionBtns v-model="organizationToEdit.filters" :idx="idx"/>
            </li>
          </ul>
          <button @click="addFilterItem" class="btn big">{{$t('add')}}</button>
        </div>

        <div class="release-types-section flex column gap20 align-start">
          <p>{{$t('organization.releaseTypes')}}</p>
          <ul class="emails flex column gap10 table-like">
            <li>
              <p>{{$t('name')}}</p>
              <p>{{$t('dataFieldsLocalFilePath')}}</p>
              <!-- <p>{{$t('dataFieldsStr')}}</p> -->
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.releaseTypes || []" :key="idx">
              <FormInput type="text" placeholder="name" v-model="curr.name"/>
              <FormInput type="text" placeholder="dataFieldsFilePath" v-model="curr.dataFieldsLocalFilePath"/>
              <!-- <FormInput type="textarea" placeholder="dataFieldsStr" v-model="curr.dataFieldsStr"/> -->
              <TableActionBtns v-model="organizationToEdit.releaseTypes" :idx="idx"/>
            </li>
          </ul>
          <button @click="addReleaseTypeItem" class="btn big">{{$t('add')}}</button>
        </div>
        
        <div class="templates-section flex column gap20 align-start">
          <p>{{$t('organization.templates')}}</p>
          <ul class="emails flex column gap10 table-like">
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
              <FormInput type="multiselect" :items="organizationToEdit.releaseTypes.map(({_id, name}) => ({value: _id, label: name}))" placeholder="releaseTypes" v-model="curr.releaseTypes"/>
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
      this.organizationToEdit = await this.$store.dispatch({ type: 'organization/loadItem', organizationId: this.$route.params.id });
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
      this.organizationToEdit.fromEmails.push({ title: '', email: '' })
    },
    addFilterItem() {
      if (!this.organizationToEdit.filters) this.organizationToEdit.filters = [];
      this.organizationToEdit.filters.push({ title: '', releaseTypes: [], wasDistributed: undefined })
    },
    addReleaseTypeItem() {
      if (!this.organizationToEdit.releaseTypes) this.organizationToEdit.releaseTypes = [];
      this.organizationToEdit.releaseTypes.push({ name: '', id: getRandomId(), fileUrl: '', dataFieldsStr: '' })
    },
    addTemplateItem() {
      if (!this.organizationToEdit.templates) this.organizationToEdit.templates = [];
      this.organizationToEdit.templates.push( { name: '', type: '' /*'0'/'1'*/ , releaseTypes: [/*releaseTypesIds*/], url: '', previewUrl: '', id: getRandomId(), hadlebarsFileStr: '' })
    },
    addLogoItem() {
      if (!this.organizationToEdit.logos) this.organizationToEdit.logos = [];
      this.organizationToEdit.logos.push({url: '', id: getRandomId(), title: ''})
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
      li {
        display: flex;
        align-items: flex-start;
        gap: em(10px);
        width: 100%;
        >* {
          flex: 1;
          &:last-child {
            flex: unset;
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
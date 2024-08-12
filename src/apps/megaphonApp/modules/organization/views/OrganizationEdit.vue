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
        <FileUploader :uploadFolderName="organizationToEdit._id" :viewAsImg="true" :value="{src: organizationToEdit.logoUrl}" @input="val => imgUploaded(val.src, 'logoUrl')"/>
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
            <FileUploader :uploadFolderName="organizationToEdit._id" :onlySrc="true" :viewAsImg="true" :value="curr.url" @input="val => imgUploaded(val, `logos.${idx}.url`)"/>
            <TableActionBtns v-model="organizationToEdit.logos" :idx="idx"/>
          </li>
        </ul>
        <button @click="addLogoItem" class="btn big">{{$t('add')}}</button>
      </div>

      <div class="media-links-section flex column gap20 align-start">
        <p>{{$t('organization.mediaLinks')}}</p>
        <ul class="flex column gap10 table-like">
          <li>
            <p>{{$t('type')}}</p>
            <p>{{$t('title')}}</p>
            <p>{{$t('url')}}</p>
            <p></p>
          </li>
          <li v-for="(curr, idx) in organizationToEdit.mediaLinks || []" :key="idx">
            <FormInput type="select" placeholder="type" v-model="curr.type" :items="['web', 'youtube', 'facebook', 'twitter', 'instegram', 'tiktok']"/>
            <FormInput type="text" placeholder="title" v-model="curr.title"/>
            <FormInput type="text" placeholder="url" v-model="curr.src"/>
            <TableActionBtns v-model="organizationToEdit.mediaLinks" :idx="idx"/>
          </li>
        </ul>
        <button @click="AddMediaLinkItem" class="btn big">{{$t('add')}}</button>
      </div>

      <div class="flex column gap20 align-start">
        <p>{{$t('organization.designPreferences')}}</p>
        <div class="input-container flex gap20">
          <!-- <p>{{$t('organization.colors')}}</p> -->
          <!-- <FormInput type="color" placeholder="organization.color" v-model="organizationToEdit.designPreferences.color"/> -->
          <FormInput type="color" labelholder="organization.bodyColor" v-model="organizationToEdit.designPreferences.colors[0]"/>
          <FormInput type="color" labelholder="organization.bodyBg" v-model="organizationToEdit.designPreferences.colors[1]"/>
        </div>
        <div class="input-container flex gap20">
          <!-- <p>{{$t('organization.bgColors')}}</p> -->
          <!-- <FormInput type="color" placeholder="organization.bgColor" v-model="organizationToEdit.designPreferences.bgColor"/> -->
          <FormInput type="color" labelholder="organization.headerColor" v-model="organizationToEdit.designPreferences.colors[2]"/>
          <FormInput type="color" labelholder="organization.headerBg" v-model="organizationToEdit.designPreferences.colors[3]"/>
        </div>
        <div class="input-container">
          <!-- <p>{{$t('organization.headersColor')}}</p> -->
          <!-- <FormInput type="color" placeholder="organization.bgColor" v-model="organizationToEdit.designPreferences.bgColor"/> -->
          <FormInput type="color" labelholder="organization.headersColor" v-model="organizationToEdit.designPreferences.colors[4]"/>
        </div>
      </div>


      <h2 @click="showDeveloperZone = !showDeveloperZone">DEVELOPER ZONE</h2>
      <div class="developer-zone flex column gap50" v-if="showDeveloperZone">
        <div class="flex column gap20">
          <FormInput :error="isDomainExistsError && $t('organization.domainTakenError') || ''" type="text" labelholder="organization.domain" v-model="organizationToEdit.domain"/>
          <FormInput type="select" labelholder="organization.clientApp" v-model="organizationToEdit.clientApp" :items="allClientAppsNames"/>
          <FormInput type="checkbox" labelholder="requireAuth" v-model="organizationToEdit.requireAuth"/>
          <FormInput type="checkbox" labelholder="require2FactorAuth" v-model="organizationToEdit.require2FactorAuth"/>
          <FormInput type="checkbox" labelholder="isStandAlone" v-model="organizationToEdit.isStandAlone"/>
        </div>
        <FormInput type="textarea" labelholder="organization.searchKeys" v-model="organizationToEdit.searchKeys"/>
        <FormInput type="text" labelholder="inheritFilePath" v-model="organizationToEdit.inheritFilePath"/>
        <div class="route-filters-section flex column gap20 align-start">
          <p>{{$t('organization.routes')}}</p>
          <ul class="flex column gap10 table-like">
            <li>
              <p>{{$t('title')}}</p>
              <p>{{$t('releaseTypes')}}</p>
              <p>{{$t('wasDistributed')}}</p>
              <p>{{$t('deepEditFilter')}}</p>
              <p>{{$t('htmlContentFilePath')}}</p>
              <p>{{$t('showInRoles')}}</p>
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.routes || []" :key="idx">
              <FormInput type="text" placeholder="name" v-model="curr.name"/>
              <FormInput type="multiselect" :items="organizationToEdit.releaseTypes.map(({id, name}) => ({value: id, label: name}))" placeholder="releaseTypes" v-model="curr.releaseFilter.releaseTypes"/>
              <FormInput type="select" :itemsMap="{undefined:undefined, true:true,false:false}" placeholder="wasDistributed" v-model="curr.releaseFilter.wasDistributed"/>
              <ToggleModal :fullScreen="true" class="filter-modal">
                <template #toggler>
                  <div class="btn">
                    {{$t('edit')}}
                  </div>
                </template>
                <template #content>
                  <FormInput type="textarea" class="ltr" placeholder="deepEditFilter" :value="JSON.stringify(curr.releaseFilter.filter || {}, null, 2)" @input="val => curr.releaseFilter.filter=JSON.parse(val)"/>
                </template>
              </ToggleModal>
              <FormInput type="text" placeholder="htmlContentFilePath" v-model="curr.htmlContentFilePath"/>
              <FormInput type="multiselect" :items="userRolesToSelect" placeholder="showInRoles" v-model="curr.showInRoles"/>
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
              <!-- <p>{{$t('id')}}</p> -->
              <p>{{$t('name')}}</p>
              <p>{{$t('dataFieldsLocalFilePath')}}</p>
              <p>{{$t('isGroup')}}</p>
              <p>{{$t('followReleaseType')}}</p>
              <!-- <p>{{$t('dataFieldsStr')}}</p> -->
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.releaseTypes || []" :key="idx">
              <!-- <FormInput type="autocomplete" placeholder="id" v-model="curr.id" :items="defaultTemplateTypesIds"/> -->
              <FormInput type="text" placeholder="name" v-model="curr.name"/>
              <FormInput type="text" placeholder="dataFieldsFilePath" v-model="curr.dataFieldsLocalFilePath"/>
              <FormInput type="checkbox" v-model="curr.isGroup"/>
              <FormInput type="select" placeholder="followReleaseType" v-model="curr.followReleaseType" :items="[...allReleaseTypes.map(c => ({ value: c.id, label: c.name })), {label: 'none', value: ''}]"/>
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
              <p>{{$t('releaseTypes')}}</p>
              <p>{{$t('templateType')}}</p>
              <p>{{$t('hadlebarsFilePath')}}</p>
              <p>{{$t('appName')}}</p>
              <p>{{$t('url')}}</p>
              <!-- <p>{{$t('previewUrl')}}</p> -->
              <!-- <p>{{$t('appName')}}</p> -->
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.templates || []" :key="idx">
              <FormInput type="text" placeholder="name" v-model="curr.name"/>
              <FormInput type="multiselect" :items="organizationToEdit.releaseTypes.map(({id, name}) => ({value: id, label: name}))" placeholder="releaseTypes" v-model="curr.releaseTypes"/>
              <FormInput type="select" :itemsMap="{landingPage: '0', newsLetter: '1'}" placeholder="templateType" v-model="curr.type"/>
              <FormInput type="text" placeholder="hadlebarsFilePath" v-model="curr.handlebarsLocalFilePath"/>
              <FormInput type="select" :items="allClientAppsNames" placeholder="appName" v-model="curr.appName"/>
              <FormInput type="text" placeholder="url" v-model="curr.url"/>
              <!-- <FormInput type="text" placeholder="previewUrl" v-model="curr.previewUrl"/> -->
              <!-- <FormInput type="text" placeholder="appName" v-model="curr.appName"/> -->

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
    <Loader v-if="isLoading" fullScreen/>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
// import ImgInput from '@/apps/common/modules/common/cmps/ImgInput.vue'
// import { uploadImg } from '../../common/services/util.service'
import { getRandomId, setDeepVal } from '../../../../common/modules/common/services/util.service'
import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import TableActionBtns from '../../../../common/modules/common/cmps/TableActionBtns.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import { organizationService } from '../services/organization.service';
import { consts } from '@/apps/common/modules/common/services/const.service.js';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import ToggleModal from '../../../../common/modules/common/cmps/ToggleModal.vue';
import { ClientApps } from '../../../..';
export default {
  name: 'OrganizationEdit',
  data() {
    return {
      itemBeforeEdit: null,
      organizationToEdit: null,
      showDeveloperZone: false,
      allDomains: [],
    }
  },
  computed: {
    userRolesToSelect: () => [...Object.values(consts.organizationRoles)].slice(1),
    isOrganizationValid() {
      const item = this.organizationToEdit;
      return !!item && !this.isDomainExistsError;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    // defaultTemplateTypesIds() {
    //   return templateUtils.DEFAULY_TEMPLATES_DATA.templates.map(c => c.id);
    // },
    allReleaseTypes() {
      return templateUtils.getAllReleaseTypesForOrg(this.organizationToEdit);
    },

    otherDomains() {
      return this.allDomains.filter(d => d !== this.itemBeforeEdit?.domain);
    },
    isDomainExistsError() {
      return this.otherDomains.includes(this.organizationToEdit.domain);
    },
    isLoading() {
      return this.$store.getters['organization/isLoading'];
    },

    allClientAppsNames() {
      return [...ClientApps.map(c => c.name), {label: '- None -', value: ''}];
    }
  },
  methods: {
    async getOrganization() {
      this.organizationToEdit = await this.$store.dispatch({ type: 'organization/loadItem', id: this.$route.params.id, isToInheritData: false });
      this.itemBeforeEdit = JSON.parse(JSON.stringify(this.organizationToEdit));
    },
    async getAllDomains() {
      this.allDomains = await this.$store.dispatch({ type: 'organization/loadAllDomainNames' });
    },
    async saveOrganization() {
      if (!this.isOrganizationValid) return;
      await this.$store.dispatch({ type: 'organization/saveItem', item: this.organizationToEdit });
      this.close();
    },
    close() {
      this.$router.push({ name: 'OrganizationPage', params: { organizationId: this.$route.params.organizationId } })
    },

    async imgUploaded(imgsrc, pathToSet) {
      // const uploadedImg = await imgUploaded(imgsrc);
      setDeepVal(this.organizationToEdit, pathToSet, imgsrc);
    },


    addFromEmailItem() {
      if (!this.organizationToEdit.fromEmails) this.organizationToEdit.fromEmails = [];
      this.organizationToEdit.fromEmails.push({ title: '', email: '' });
    },
    addRouteFilterItem() {
      if (!this.organizationToEdit.routes) this.organizationToEdit.routes = [];
      this.organizationToEdit.routes.push(organizationService.createEmptyRouteItem());
    },
    addInnerFilterItem() {
      if (!this.organizationToEdit.innerFilters) this.organizationToEdit.innerFilters = [];
      this.organizationToEdit.innerFilters.push(organizationService.createEmptyInnerFilterItem());
    },
    addReleaseTypeItem() {
      if (!this.organizationToEdit.releaseTypes) this.organizationToEdit.releaseTypes = [];
      this.organizationToEdit.releaseTypes.push(organizationService.createEmptyReleaseTypeItem());
    },
    addTemplateItem() {
      if (!this.organizationToEdit.templates) this.organizationToEdit.templates = [];
      this.organizationToEdit.templates.push(organizationService.createEmptyTemplateItem());
    },
    addLogoItem() {
      if (!this.organizationToEdit.logos) this.organizationToEdit.logos = [];
      this.organizationToEdit.logos.push({url: '', id: getRandomId(), title: ''});
    },
    AddMediaLinkItem() {
      if (!this.organizationToEdit.mediaLinks) this.organizationToEdit.mediaLinks = [];
      this.organizationToEdit.mediaLinks.push({src: '', id: getRandomId(), type: '', title: ''});
    },
  },
  created() {
    this.getOrganization();
    this.getAllDomains();
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
    TableActionBtns,
    Loader,
    ToggleModal
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .organization-edit {
    form, .developer-zone {
      width: 100%;
      >* {
        width: 100%;
        padding-bottom: em(10px);
        border-bottom: em(1px) solid var(--clr-0);
      }
    }
    .table-like {
      // width: 100%;
      // overflow-x: auto;
      // max-width: 100%;
      max-width: 95vw;
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
          width: em(200px);
          &:last-child {
            flex: unset;
            width: em(100px);
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
          width: em(200px);
          // &:last-child {
          //   flex: unset;
          // }
        }
        >:nth-child(2) {
          width: em(325px);
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

    .filter-modal {
      .actual-input {
        width: 60vw;
        height: 60vh;
        .input {
          width: 100%;
          height: 100% !important;
        }
      }
    }
  }
}
</style>
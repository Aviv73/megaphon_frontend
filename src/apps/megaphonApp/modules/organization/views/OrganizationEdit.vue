<template>
  <div v-if="organizationToEdit" class="organization-edit app-form-styling simple-form flex column gap40 width-all">
    <!-- <h2 v-if="organizationToEdit._id">{{$t('organizationLocales.editOrganization')}}</h2> -->
    <h2 v-if="organizationToEdit._id">{{$t('organizationLocales.organizationSettings')}}</h2>
    <h2 v-else>{{$t('organizationLocales.createOrganization')}}</h2>
    <form v-if="organizationToEdit" @submit.prevent="" class="flex column width-all gap50 align-start">
      <div class="input-container">
        <p>{{$t('organizationLocales.name')}}</p>
        <FormInput type="text" placeholder="organizationLocales.name" v-model="organizationToEdit.name"/>
      </div>
      <div class="flex column gap20">
        <p>{{$t('organizationLocales.logo')}}</p>
        <FileUploader v-if="organizationToEdit._id" :uploadFolderName="organizationToEdit._id" :parentData="{col: 'organization', _id: organizationToEdit._id}" :viewAsImg="true" :value="organizationToEdit.logo" @input="val => imgUploaded(val, 'logo')" :rootItem="organizationToEdit"/>
        <p v-else>{{$t('organizationLocales.saveOrgToUploadFilesMsg')}}</p>
      </div>

      <div class="from-emails-section flex column gap20 align-start">
        <p>{{$t('organizationLocales.fromEmails')}}</p>
        <ul class="emails flex column gap10 table-like">
          <li>
            <p>{{$t('email')}}</p>
            <p>{{$t('name')}}</p>
            <p>{{$t('distributeLocales.allowReply')}}</p>
            <p></p>
          </li>
          <li v-for="(curr, idx) in organizationToEdit.fromEmails || []" :key="idx">
            <FormInput type="text" placeholder="name" v-model="curr.email"/>
            <FormInput type="text" placeholder="name" v-model="curr.title"/>
            <FormInput type="checkbox" placeholder="distributeLocales.allowReply" class="width-content" v-model="curr.allowReply"/>
            <TableActionBtns v-model="organizationToEdit.fromEmails" :idx="idx" :allowEmptyArray="true"/>
          </li>
        </ul>
        <button @click="addFromEmailItem" class="btn big">{{$t('add')}}</button>
      </div>

      <div class="media-links-section flex column gap20 align-start">
        <p>{{$t('organizationLocales.mediaLinks')}}</p>
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
            <TableActionBtns v-model="organizationToEdit.mediaLinks" :idx="idx" :allowEmptyArray="true"/>
          </li>
        </ul>
        <button @click="AddMediaLinkItem" class="btn big">{{$t('add')}}</button>
      </div>

      <div class="flex column gap20 align-start">
        <p>{{$t('settingsLocales.settings')}}</p>
        <FormInput type="checkbox" labelholder="organizationLocales.requireAuth" v-model="organizationToEdit.requireAuth"/>
        <FormInput type="checkbox" labelholder="organizationLocales.require2FactorAuth" v-if="organizationToEdit.requireAuth" v-model="organizationToEdit.require2FactorAuth"/>
        <FormInput type="checkbox" labelholder="organizationLocales.useVideoWaterMark" v-model="organizationToEdit.useVideoWaterMark"/>
      </div>
      
      <div class="flex column gap20 align-start" v-if="organizationToEdit.requireAuth">
        <p>{{$t('organizationLocales.loginPagePreferences')}}</p>
        <!-- <FileUploader :uploadFolderName="organizationToEdit._id" :viewAsImg="true" :value="{src: organizationToEdit.designPreferences.loginPage[0].bgImg}" @input="val => imgUploaded(val.src, 'designPreferences.loginPage.0.bgImg')"/> -->
        <div class="flex column gap20">
          <p>{{$t('organizationLocales.loginPageBgImage')}}</p>
          <ImageCrop v-if="itemBeforeEdit._id" :value="organizationToEdit.designPreferences.loginPage[0].bgImg" :uploadFolderName="organizationToEdit._id" :parentData="{col: 'organization', _id: organizationToEdit._id}" @input="val => imgUploaded(val, 'designPreferences.loginPage.0.bgImg')" :rootItem="organizationToEdit"/>
          <p v-else>{{$t('organizationLocales.saveOrgToUploadFilesMsg')}}</p>
        </div>
        <FormInput type="textarea" labelholder="organizationLocales.loginPageMsg" v-model="organizationToEdit.designPreferences.loginPage[0].msg"/>
      </div>

      <template v-if="loggedUser?.roles.includes('admin')">
        <div class="flex column gap20">
          <div class="input-container">
            <p>{{$t('organizationLocales.defaultGalleryCredit')}}</p>
            <FormInput type="text" placeholder="organizationLocales.defaultGalleryCredit" v-model="organizationToEdit.defaultGalleryCredit"/>
          </div>
          <div class="input-container">
            <p>{{$t('organizationLocales.distributionBcc')}}</p>
            <FormInput type="text" placeholder="organizationLocales.distributionBcc" v-model="organizationToEdit.distributionBcc"/>
          </div>
        </div>

        
        <div class="logos-section flex column gap20 align-start">
          <p>{{$t('organizationLocales.logos')}}</p>
          <ul  v-if="organizationToEdit._id" class="flex column gap10 table-like">
            <li>
              <p>{{$t('name')}}</p>
              <p>{{$t('file')}}</p>
              <p></p>
            </li>
            <li v-for="(curr, idx) in organizationToEdit.logos || []" :key="idx">
              <FormInput type="text" placeholder="name" v-model="curr.title"/>
              <!-- <FileUploader :uploadFolderName="organizationToEdit._id" :onlySrc="true" :viewAsImg="true" :value="curr.url" @input="val => imgUploaded(val, `logos.${idx}.url`)"/> -->
              <FileUploader :uploadFolderName="organizationToEdit._id" :parentData="{col: 'organization', _id: organizationToEdit._id}" :viewAsImg="true" :value="curr" @input="val => imgUploaded(val, `logos.${idx}`)" :rootItem="organizationToEdit"/>
              <TableActionBtns v-model="organizationToEdit.logos" :idx="idx"/>
            </li>
          </ul>
          <p v-else>{{$t('organizationLocales.saveOrgToUploadFilesMsg')}}</p>
          <button @click="addLogoItem" class="btn big">{{$t('add')}}</button>
        </div>
      </template>



      <div class="flex column gap50" v-if="loggedUser?.roles.includes('developer')">
        <button class="btn big secondary align-self-start"><span @click="showDeveloperZone = !showDeveloperZone">DEVELOPER ZONE</span></button>
        <div class="developer-zone flex column gap50" v-if="showDeveloperZone">
          <FormInput type="text" labelholder="inheritFilePath" v-model="organizationToEdit.inheritFilePath"/>
          <FormInput type="text" labelholder="redirectUrl" v-model="organizationToEdit.redirectUrl"/>
          
          <div class="flex column align-start gap20">
            <FormInput :error="isDomainExistsError && $t('organizationLocales.domainTakenError') || ''" type="text" labelholder="organizationLocales.domain" v-model="organizationToEdit.domain"/>
            <FormInput type="select" labelholder="organizationLocales.clientApp" v-model="organizationToEdit.clientApp" :items="allClientAppsNames"/>
            
            <FormInput type="checkbox" title="isStandAlone" labelholder="isStandAlone" v-model="organizationToEdit.isStandAlone"/>
            <FormInput type="checkbox" title="onlyKnownRegistrations" labelholder="onlyKnownRegistrations" v-model="organizationToEdit.onlyKnownRegistrations"/>
            <FormInput type="checkbox" title="useDirectLink" labelholder="useDirectLink" v-model="organizationToEdit.useDirectLink"/>
            <FormInput type="checkbox" title="dontUseGlobalDbData" labelholder="dontUseGlobalDbData" v-model="organizationToEdit.dontUseGlobalDbData"/>
            <FormInput type="checkbox" title="restrictVideos" labelholder="restrictVideos" v-model="organizationToEdit.restrictVideos"/>
          </div>
          <FormInput type="textarea" labelholder="organizationLocales.searchKeys" v-model="organizationToEdit.searchKeys"/>

          
          <div class="flex column gap40 align-start">
            <p>{{$t('organizationLocales.designPreferences')}}</p>

            <div class="flex column gap20" v-for="designAppKey in ['producerApp', 'clientApp', 'newsletter']" :key="designAppKey">
              <p>{{designAppKey}}</p>
              <div v-for="theme in organizationToEdit.designPreferences[designAppKey]" :key="theme.id" class="flex column gap10">
                <FormInput type="text" labelholder="name" v-model="theme.name"/>
                <FormInput type="select" class="gap10" labelholder="inheritTheme" :value="null" :items="allDefaultThemes" @change="val => inheritTheme(theme, val)"/>
                <div class="input-container flex gap20">
                  <FormInput type="color" labelholder="organizationLocales.bodyColor" v-model="theme.colors[0]"/>
                  <FormInput type="color" labelholder="organizationLocales.bodyBg" v-model="theme.colors[1]"/>
                  <FormInput type="color" labelholder="organizationLocales.headerColor" v-model="theme.colors[2]"/>
                  <FormInput type="color" labelholder="organizationLocales.headerBg" v-model="theme.colors[3]"/>
                  <FormInput type="color" labelholder="organizationLocales.headersColor" v-model="theme.colors[4]"/>
                  <FormInput type="color" labelholder="organizationLocales.headersBgColor" v-model="theme.colors[5]"/>
                  <FormInput type="color" labelholder="organizationLocales.linkColor" v-model="theme.colors[6]"/>
                </div>
                <ToggleModal :fullScreen="true" class="code-edit-modal">
                  <template #toggler>
                    <div class="btn">
                      {{$t('css')}}
                    </div>
                  </template>
                  <template #content>
                    <FormInput type="textarea" class="ltr" placeholder="editCssCode" v-model="theme.css"/>
                  </template>
                </ToggleModal>
              </div>
              <button class="btn width-content" @click="addTheme(organizationToEdit.designPreferences[designAppKey])">Add theme</button>
            </div>

            <!-- LOGIN PAGE PREFERENCES WAS HERE -->
            <div class="flex column gap20 align-start">
              <p>{{$t('organizationLocales.contactMsg')}}</p>
              <FormInput type="text" labelholder="organizationLocales.contactMsg" v-model="organizationToEdit.designPreferences.contactMsg"/>
            </div>
          </div>

          <div class="route-filters-section flex column gap20 align-start">
            <p>{{$t('organizationLocales.routes')}}</p>
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
                <ToggleModal :fullScreen="true" class="code-edit-modal">
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
            <p>{{$t('organizationLocales.innerFilters')}}</p>
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
                <!-- <FormInput type="text" placeholder="options" v-model="curr.options"/> -->
                <ToggleModal :fullScreen="true" class="code-edit-modal">
                  <template #toggler>
                    <div class="btn">
                      {{$t('edit JSON')}}
                    </div>
                  </template>
                  <template #content>
                    <FormInput type="textarea" class="ltr" placeholder="edit JSON" :value="JSON.stringify(curr.options, null, 2)" @input="val => curr.options = JSON.parse(val)"/>
                  </template>
                </ToggleModal>
                <TableActionBtns v-model="organizationToEdit.innerFilters" :idx="idx"/>
              </li>
            </ul>
            <button @click="addInnerFilterItem" class="btn big">{{$t('add')}}</button>
          </div>

          <div class="release-types-section flex column gap20 align-start">
            <p>{{$t('organizationLocales.releaseTypes')}}</p>
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
            <p>{{$t('organizationLocales.templates')}}</p>
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
                <FormInput type="select" :itemsMap="{landingPage: 'landingPage', email: 'email'}" placeholder="templateType" v-model="curr.type"/>
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
      </div>
    </form>
    <div class="flex gap10 form-footer">
      <button class="btn big primary" @click="saveAndClose" :disabled="!isOrganizationValid">{{$t('saveAndClose')}}</button>
      <button class="btn big primary" @click="saveOrganization" :disabled="!isOrganizationValid">{{$t('save')}}</button>
      <button class="btn big" @click="close">{{$t('cancel')}}</button>
    </div>
    <Loader v-if="isLoading" fullScreen/>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'
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
import ImageCrop from '../../release/cmps/DynamicFormInputs/ImageCrop.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';


import allDefaultThemes from '../../../themes/index';

export default {
  name: 'OrganizationEdit',
  data() {
    return {
      itemBeforeEdit: null,
      organizationToEdit: null,
      showDeveloperZone: false,
      allDomains: [],

      allDefaultThemes: allDefaultThemes.map(c => ({label: c.name, value: c}))
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
    },
    
    didChange() {
      return JSON.stringify(this.organizationToEdit) !== JSON.stringify(this.itemBeforeEdit);
    },
  },
  methods: {
    async getOrganization() {
      this.organizationToEdit = await this.$store.dispatch({ type: 'organization/loadItem', id: this.$route.params.id, isToInheritData: true });
      this.itemBeforeEdit = JSON.parse(JSON.stringify(this.organizationToEdit));
    },
    async getAllDomains() {
      this.allDomains = await this.$store.dispatch({ type: 'organization/loadAllDomainNames' });
    },
    async saveOrganization() {
      if (!this.isOrganizationValid) return;
      this.organizationToEdit = JSON.parse(JSON.stringify(await this.$store.dispatch({ type: 'organization/saveItem', item: this.organizationToEdit })));
      this.itemBeforeEdit = JSON.parse(JSON.stringify(this.organizationToEdit));
      console.log('SAVED ORGANIZATION', this.organizationToEdit);
    },
    async saveAndClose() {
      await this.saveOrganization();
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
    addTheme(themesArr) {
      themesArr.push(organizationService.getEmptyThemeItem());
    },

    inheritTheme(theme, themeToInherit) {
      // for (let key in theme) {
      //   theme[key] = inheritTheme[key]
      // }
      if (themeToInherit.name) theme.name = themeToInherit.name;
      if (themeToInherit.css) theme.css = themeToInherit.css;
      if (themeToInherit.colors) theme.colors = [...themeToInherit.colors];
      if (themeToInherit.fonts) theme.fonts = [...themeToInherit.fonts];
      // this.$forceUpdate();
    }
  },
  created() {
    this.getOrganization();
    this.getAllDomains();
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.didChange) return next();
    const doesWantToLeave = await alertService.Confirm(this.$t('releaseLocales.alerts.leaveConfirm'), undefined, '<style>.A-Alert .alert-modal .a-alert-confirm-btn {border: none !important; box-shadow: none !important;}</style>');
    if (!doesWantToLeave) return next(false);
    else return next(true);
  },
  watch: {
    '$route.params.id'() {
      this.getOrganization();
    }
  },
  components: {
    FormInput,
    FileUploader,
    TableActionBtns,
    Loader,
    ToggleModal,
    ImageCrop
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .organization-edit {
    padding: em(10px) 0;
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

    .code-edit-modal {
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
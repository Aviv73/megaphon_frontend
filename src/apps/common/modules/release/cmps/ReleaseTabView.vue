<template>
  <div class="release-tab-view height-all flex align-start gap50" v-if="release">
    <div class="wide-screen-item release-page-nav wide-screen-item sticky flex column gap10" v-if="allTabNames.length">
      <!-- :style="{position: 'fixed', top: '110px'}" -->
      <template v-for="tabName in allTabNames || ['content', 'images', 'videos', 'files', 'links']">
        <a
          :key="tabName"
          :class="{bold: selectedTab === tabName}" 
          @click="scrollToEl($event, tabName)"
          v-if="validateTab(tabName)"
        >
          {{$t(`release.tabs.${tabName}`)}}
        </a>
      </template>
      <!-- <a :class="{selected: selectedTab === ''}" @click="scrollToEl('links')" v-if="release.links.filter(c => c.src).length">{{$t('release.links')}}</a> -->
    </div>
    <div class="flex column gap20">
      <template v-for="(field, idx) in dataFieldsToShow">
        <div :key="field.fieldName || idx" :id="field.fieldName" v-if="!isScreenWide || !allTabNames.length || (tabView && field.uiSections?.includes(selectedTab))" :class="field.fieldName + '-division'">
          <DynamicField :dataField="field" :value="releaseData[field.fieldName]" :parentItem="releaseData"/>
        </div>
      </template>
      <!-- <FilesSection :release="releaseData"/> -->
    </div>
  </div>
</template>

<script>
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

import { templateUtils } from '../../common/services/template.util.service';
import FilesSection from '../cmps/FilesSection.vue';
import DynamicField from '../cmps/DynamicField.vue';

import { isDateValid, scrollToEl } from '../../common/services/util.service';
import { validateDataByDataField } from '../../../../megaphonApp/modules/common/services/dynamicFormService';

export default {
  name: 'common_ReleaseDetails',
  props: {
    tabView: Boolean,
    release: Object
  },
  data() {
    return  {
      dataFields: [],
      selectedTab: ''
    }
  },
  methods: {
    async loadReleaseDataFields() {
      await this.$store.dispatch({ type: 'organization/loadItem', id: this.$route.params.organizationId });
      this.dataFields = await this.$store.dispatch({ type: 'organization/loadReleaseDataFields', dataFieldsLocalFilePath: this.selectedReleaseTypeItem?.dataFieldsLocalFilePath, organizationId: this.org._id, releaseType: this.releaseType });
      this.selectedTab = this.allTabNames[0];
    },
    async init() {
      this.loadReleaseDataFields();
      const locale = this.release?.design?.locale || 'he';
      if (locale) this.$i18n.locale = locale;
    },

    
    scrollToEl(ev, elId) {
      ev.preventDefault();
      this.selectedTab = elId;
      return scrollToEl(`#${elId}`, -20);
    },

    validateTab(tabName) {
      return true;
      // const relevantTabFields = this.dataFields.filter(c => c.uiSections?.includes(tabName)).filter(c => c.fieldName);
      // console.log(tabName, relevantTabFields);
      // for (let field of relevantTabFields) {
      //   console.log(field.fieldName, this.releaseData, this.releaseData[field.fieldName])
      //   if (!field.fieldName in this.releaseData) continue;
      //   const isCurrValid = (() => {
      //     if (typeof this.releaseData[field.fieldName] === 'string') return !!this.releaseData[field.fieldName];
      //     if (Array.isArray(this.releaseData[field.fieldName])) return !!this.releaseData[tabName]?.filter(c => c.src).length;
      //     else if (this.releaseData[field.fieldName]) return true;
      //   })();
      //   if (isCurrValid) return true;
      // }
      // return false;
    }
  },
  computed: {
    org() {
      return this.$store.getters['organization/selectedItem'];
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },

    releaseType() {
      return this.release?.releaseType;
    },
    
    selectedReleaseTypeItem() {
      if (!this.releaseType) return null;
      return templateUtils.getRelevantReleaseTypeItemForRelease(this.releaseType, this.org);
    },

    isMonthlyRelease() {
      // return this.release.releaseData.page === 'group';
      return !!this.release.releaseData.childrenReleases;
    },

    releaseData() {
      return {...this.release.releaseData, _id: this.release._id};
    },

    dataFieldsToShow() {
      return this.dataFields
              .reduce((acc, c) => [...acc, ...(c.type === 'ROW'? c.fields : [c])], [])
              .filter(c => !c.hideFromUi)
              .filter((field) => {
                return validateDataByDataField(field, this.releaseData[field.fieldName]);
                // if (typeof this.releaseData[field.fieldName] === 'string') return !!this.releaseData[field.fieldName];
                // if (Array.isArray(this.releaseData[field.fieldName])) return !!this.releaseData[field.fieldName]?.filter(c => c.src).length;
                // else if (this.releaseData[field.fieldName]) return true;
              })
              .sort((a, b) => {
                // if (a.index === b.index) return 0;
                // else if (!'index' in a) return 1;
                // else if (!'index' in b) return -1;
                return (a.index || 100) - (b.index || 100)
              })
    },

    allTabNames() {
      return Array.from(new Set(this.dataFieldsToShow.map(c => c.uiSections).filter(Boolean).reduce((acc, c) => [...acc, ...c], [])));
    }
  },
  created() {
    this.init();
  },
  destroyed() {
    evEmmiter.emit('set_locale'); // reset locale to uiConfig locale
  },
  watch: {
    '$route.params.id'() {
      this.init();
    }
  },
  components: {
    FilesSection,
    DynamicField
  }
}
</script>
  
<style lang="scss">
@import '@/assets/styles/global/index';
.release-tab-view {
  .release-page-nav {
    height: fit-content;
    top: calc(#{em(10px)} + #{$header-height});
  }
}
</style>
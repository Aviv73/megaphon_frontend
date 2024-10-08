<template>
  <div class="release-tab-view height-all flex align-start_ gap100" v-if="release">
    <div class="release-page-nav sticky flex column space-between_ gap100 wide-screen-item">
      <div class="wide-screen-item flex column gap10_" v-if="allTabNames.length">
        <!-- :style="{position: 'fixed', top: '110px'}" -->
        <template v-for="tab in allTabNames || ['content', 'images', 'videos', 'files', 'links']">
          <template v-if="validateTab(tab.name)">
            <a
              v-if="tab.type === 'section'"
              class="tab-link"
              :key="tab.name"
              :class="{bold: selectedTab === tab.name, selected: selectedTab === tab.name}" 
              @click="scrollToEl($event, tab.name)"
              
            >
              {{$t(`release.tabs.${tab.name}`)}}
            </a>
            <router-link
              v-else-if="tab.type === 'fileViewer'"
              class="tab-link"
              :key="tab.name"
              :class="{bold: selectedTab === tab.name, selected: selectedTab === tab.name}" 
              :to="{ name: 'FileViewer', query: {file: tab.url} }"
            >
              {{$t(`release.tabs.${tab.name}`)}}
            </router-link>
          </template>
        </template>
        <!-- <a :class="{selected: selectedTab === ''}" @click="scrollToEl('links')" v-if="release.links.filter(c => c.src).length">{{$t('release.links')}}</a> -->
      </div>
      <div>
        <slot/>
      </div>
    </div>
    <div class="flex column flex-1 gap30">
      <template v-for="(field, idx) in dataFieldsToShow">
        <div :key="field.fieldName || idx" :id="field.fieldName" v-if="!isScreenWide || !allTabNames.length || (tabView && field.uiSections?.includes(selectedTab))" :class="field.fieldName + '-display'">
          <DynamicField :dataField="field" :value="releaseData[field.fieldName]" :parentItem="releaseData" :organization="org" :release="release"/>
        </div>
      </template>
      <!-- <FilesSection :releaseData="releaseData" :organizationId="release.organizationId"/> -->
    </div>
  </div>
</template>

<script>
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';
import { fixFileSrcToThumbnail, fixVideoSrcToThumbnail } from '../../common/services/file.service';

import { templateUtils } from '../../common/services/template.util.service';
// import FilesSection from '../cmps/FilesSection.vue';
import DynamicField from '../cmps/DynamicField.vue';

import { isDateValid, scrollToEl } from '../../common/services/util.service';
import { validateDataByDataField } from '../../../../megaphonApp/modules/common/services/dynamicFormService';

export default {
  name: 'ReleaseTabView',
  props: {
    tabView: Boolean,
    release: Object,
    hideTabs: Array,
    mapTabs: Function,
  },
  data() {
    return  {
      dataFields: [],
      selectedTab: ''
    }
  },
  methods: {
    fixFileSrcToThumbnail,
    async loadReleaseDataFields() {
      // await this.$store.dispatch({ type: 'organization/loadItem', id: this.$route.params.organizationId });
      // this.dataFields = await this.$store.dispatch({ type: 'organization/loadReleaseDataFields', dataFieldsLocalFilePath: this.selectedReleaseTypeItem?.dataFieldsLocalFilePath, organizationId: this.org._id, releaseType: this.releaseType });
      this.dataFields = (await this.$store.dispatch({ type: 'organization/loadReleaseDataFields', dataFieldsLocalFilePath: this.selectedReleaseTypeItem?.dataFieldsLocalFilePath, organizationId: this.release.organizationId, releaseType: this.releaseType })).filter(c => !c.disabled);
      this.selectedTab = this.$route.query.tab || this.allTabNames[0].name;
    },
    async init() {
      this.loadReleaseDataFields();
      const locale = this.release?.design?.locale || 'he';
      if (locale) this.$i18n.locale = locale;
    },

    
    scrollToEl(ev, elId) {
      ev.preventDefault();
      this.selectedTab = elId;
      this.$router.push({query: {...(this.$route.query || {}), tab: elId}});
      return scrollToEl(`#${elId}`, -20);
    },

    validateTab(tabName) {
      if (this.hideTabs?.includes(tabName)) return false;
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
      return !!this.release?.releaseData?.childrenReleases;
    },

    releaseData() {
      return {...this.release.releaseData, _id: this.release._id};
    },

    dataFieldsToShow() {
      const formatFields = (fields = []) => {
        return fields
              // .reduce((acc, c) => [...acc, ...(c.type === 'ROW'? c.fields : [c])], [])
              .filter(c => !c.hideFromUi)
              .filter((field) => {
                return validateDataByDataField(field, this.releaseData[field.fieldName], this.releaseData, this.release);
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
              .map(c => {
                if (c.type === 'ROW') {
                  c.fields = formatFields(c.fields);
                }
                return c;
              })
              .filter(c => {
                if ((c.type === 'ROW') && !c.fields.length) return false;
                return true; 
              });
      }
      return formatFields(this.dataFields);
      // return this.dataFields
      //         .reduce((acc, c) => [...acc, ...(c.type === 'ROW'? c.fields : [c])], [])
      //         .filter(c => !c.hideFromUi)
      //         .filter((field) => {
      //           return validateDataByDataField(field, this.releaseData[field.fieldName]);
      //           // if (typeof this.releaseData[field.fieldName] === 'string') return !!this.releaseData[field.fieldName];
      //           // if (Array.isArray(this.releaseData[field.fieldName])) return !!this.releaseData[field.fieldName]?.filter(c => c.src).length;
      //           // else if (this.releaseData[field.fieldName]) return true;
      //         })
      //         .sort((a, b) => {
      //           // if (a.index === b.index) return 0;
      //           // else if (!'index' in a) return 1;
      //           // else if (!'index' in b) return -1;
      //           return (a.index || 100) - (b.index || 100)
      //         })
    },

    allTabNames() {
      return Array.from(new Set(this.dataFieldsToShow.map(c => c.uiSections).filter(Boolean).reduce((acc, c) => [...acc, ...c], []))).map(c => ({
        name: c,
        type: 'section',
        ...(this.mapTabs? this.mapTabs(c) : [])
      }));
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
    // FilesSection,
    DynamicField
  }
}
</script>
  
<style lang="scss">
@import '@/assets/styles/global/index';
.release-tab-view {
  .release-page-nav {
    height: fit-content;
    // top: calc(#{em(10px)} + #{$header-height});
    top: em(20px);
    width: rem(150px);
    .tab-link {
      padding: em(15px) 0;
      &:first-child {
        padding-top: 0;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #595959;
      }
      &.selected {
        color: var(--clr-4);
        font-weight: bold;
      }
    }
  }
}
</style>
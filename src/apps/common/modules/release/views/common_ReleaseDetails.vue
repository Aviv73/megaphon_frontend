<template>
  <div class="release-details height-all inner-container main-pad-y flex align-start gap50" v-if="release">
    <div class="wide-screen-item release-page-nav wide-screen-item sticky flex column gap10">
      <!-- :style="{position: 'fixed', top: '110px'}" -->
      <template v-for="tabNames in [['content'], ['images', 'imageGallery'], ['videos'], ['files'], ['links']]">
        <a
          :key="tabNames[0]"
          :class="{bold: selectedTab === tabNames[0]}" 
          @click="scrollToEl($event, tabNames[0])"
          v-if="validateTab(tabNames)"
        >
          {{$t(`release.${tabNames[0]}`)}}
        </a>
      </template>
      <!-- <a :class="{selected: selectedTab === ''}" @click="scrollToEl('links')" v-if="release.links.filter(c => c.src).length">{{$t('release.links')}}</a> -->
    </div>
    <div class="flex column gap40">
      <div v-for="(field, idx) in dataFieldsToShow" :key="field.fieldName || idx" :id="field.fieldName">
        <DynamicField :dataField="field" :value="releaseData[field.fieldName]" :parentItem="releaseData"/>
      </div>
      <!-- <FilesSection :release="releaseData"/> -->
    </div>
  </div>
</template>

<script>
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

import { templateUtils } from '../../common/services/template.util.service';
import FilesSection from '../cmps/FilesSection.vue';
import { scrollToEl } from '../../common/services/util.service';
import DynamicField from '../cmps/DynamicField.vue';



export default {
  name: 'common_ReleaseDetails',
  data() {
    return  {
      dataFields: [],
      selectedTab: ''
    }
  },
  methods: {
    getItem() {
      return this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id, organizationId: this.$route.params.organizationId });
    },
    async loadReleaseDataFields() {
      await this.$store.dispatch({ type: 'organization/loadItem', id: this.$route.params.organizationId });
      this.dataFields = await this.$store.dispatch({ type: 'organization/loadReleaseDataFields', dataFieldsLocalFilePath: this.selectedReleaseTypeItem?.dataFieldsLocalFilePath, organizationId: this.org._id, releaseType: this.releaseType });
    },
    async init() {
      await this.getItem();
      this.loadReleaseDataFields();
      const locale = this.release?.design?.locale || 'he';
      if (locale) this.$i18n.locale = locale;
    },

    
    scrollToEl(ev, elId) {
      ev.preventDefault();
      this.selectedTab = elId;
      return scrollToEl(`#${elId}`, -20);
    },

    validateTab(tabNames) {
      for (let tabName of tabNames) {
        if (!(tabName in this.releaseData)) continue;
        return typeof this.releaseData[tabName] === 'string'? !!this.releaseData[tabName] : this.releaseData[tabName]?.filter(c => c.src || c.link || c.url).length
      }
      return false;
    }
  },
  computed: {
    release() {
      return this.$store.getters['release/selectedItem'];
    },
    org() {
      return this.$store.getters['organization/selectedItem'];
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
              .filter(c => !c.hideFromUi)
              .sort((a, b) => {
                // if (a.index === b.index) return 0;
                // else if (!'index' in a) return 1;
                // else if (!'index' in b) return -1;
                return (a.index || 100) - (b.index || 100)
              })
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
.release-details {
  .release-page-nav {
    height: fit-content;
    top: calc(#{em(10px)} + #{$header-height});
  }
}
</style>
<template>
  <div class="release-design-viewer flex column align-center gap10">
    <div class="tab-nav light width-all flex gap10 align-end">
      <button @click="selectedDesignTypeToShow = 'landingPage'" :class="{selected: selectedDesignTypeToShow === 'landingPage'}" :disabled="!release._id">{{$t('releaseLocales.landingPageDesign')}}</button>
      <button @click="selectedDesignTypeToShow = 'email'" :class="{selected: selectedDesignTypeToShow === 'email'}">{{$t('releaseLocales.newsletterDesign')}}</button>
    </div>
    <div class="flex align-center justify-center gap50">
      <ToggleBtns v-model="previewPlatform" :options="[
        {value: 'desktop', img: require('@/apps/megaphonApp/assets/images/devices/desktop.jpg')},
        {value: 'tablet', img: require('@/apps/megaphonApp/assets/images/devices/tablet.jpg')},
        {value: 'mobile', img: require('@/apps/megaphonApp/assets/images/devices/mobile.png')},
      ]"/>
      <!-- <FormInput
        :debug="true"
        type="select"
        :value="release.design[designTypeKey] || allTemplates[0]?.id || ''"
        @change="val => $emit('design-template-updated', designTypeKey, val)"
        :items="
          allTemplates
            .map(c => ({ label: c.name, value: c.id }))
        "
      /> -->
    </div>
    <FullScreenToggler class="width-all flex-1" v-if="landingPageUrl">
      <iframe :style="iframeStyle" :src="landingPageUrl" frameborder="0"></iframe>
    </FullScreenToggler>
    <p v-else>{{$t('noMatchingDesign')}}</p>
  </div>
</template>

<script>
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import ToggleBtns from '../../../../common/modules/common/cmps/ToggleBtns.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';

import config from '@/config';
import FullScreenToggler from '../../../../common/modules/common/cmps/FullScreenToggler.vue';

export default {
  name: 'ReleaseDesignViewer',
  components: { ToggleBtns, FormInput, FullScreenToggler },
  props: {
    release: {
      type: Object
    },
    organization: {
      type: Object
    },
  },
  data() {
    return {
      selectedDesignTypeToShow: 'landingPage',
      previewPlatform: 'desktop', // / tablet / mobile
    }
  },
  computed: {
    designTypeKey() {
      return this.selectedDesignTypeToShow;
    },
    landingPageUrl() {
      return templateUtils.getReleaseLandingPageUrl(this.release, this.organization, this.selectedDesignTypeToShow, config) + '?selectedDesignID=' + this.release.design[this.designTypeKey];
    },
    allTemplates() {
      return templateUtils.getAllRelevantTemplatesForReleaseType(this.release.releaseType, this.organization, this.selectedDesignTypeToShow, true);
      // return this.org.templates
      //           .filter(c => c.releaseTypes.includes(itemToEdit.releaseType))
      //           .filter(c => c.type == selectedDesignTypeToShow);
    },
    iframeStyle() {
      switch ( this.previewPlatform) {
        case 'desktop': 
          return { width: '100%', height: '700px' }
          // return { width: '100%', height: '100%' }
        case 'tablet': 
          return { width: '50%', height: '700px' }
        case 'mobile': 
          return { width: '400px', height: '700px' }
      }
    },
  }
}
</script>

<style lang="scss">
.megaphon-app {
  .release-design-viewer {
    iframe {
      background-color: #fff;
      direction: ltr !important;
    }
    .toggle-btns {
      background-color: #fff;
    }
  }
}
</style>
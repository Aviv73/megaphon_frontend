<template>
  <div class="release-design-viewer flex column align-center text-center gap10">
    <div class="actions flex align-center gap30">
      <div class="tab-nav_ light width-all flex gap20 align-end">
        <button class="underline" @click="selectedDesignTypeToShow = 'landingPage'" :class="{selected: selectedDesignTypeToShow === 'landingPage', bold: selectedDesignTypeToShow === 'landingPage'}" :disabled="!release._id">{{$t('releaseLocales.landingPageDesign')}}</button>
        <button class="underline" @click="selectedDesignTypeToShow = 'email'" :class="{selected: selectedDesignTypeToShow === 'email', bold: selectedDesignTypeToShow === 'email'}">{{$t('releaseLocales.newsletterDesign')}}</button>
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
      <button class="" @click="$emit('close')">{{$t('close')}}</button>
    </div>
    <FullScreenToggler :initFullScreen="false" class="width-all flex-1" v-if="landingPageUrl">
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
      return templateUtils.getReleaseLandingPageUrl(this.release, this.organization, this.selectedDesignTypeToShow, config, window.location.pathname) + '?selectedDesignID=' + this.release.design[this.designTypeKey];
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
          return { width: '100%', height: '100vh' }
          // return { width: '100%', height: '100%' }
        case 'tablet': 
          return { width: '50%', height: '100vh' }
        case 'mobile': 
          return { width: '400px', height: '100vh' }
      }
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-design-viewer {
    position: fixed;
    top: 0;
    inset-inline-end: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background-color: #6b6b6b;
    overflow: hidden;
    iframe {
      background-color: #fff;
      direction: ltr !important;
      height: 100%;
    }
    .toggle-btns {
      background-color: #fff;
    }
    .full-screen-btn {
      inset-inline-end: unset !important;
      top: unset !important;
      bottom: em(10px) !important;
      inset-inline-start: em(10px) !important;
      background-color: #fff;
      z-index: 1001;
      display: none;
    }
    .actions {
      position: absolute;
      top: em(10px);
      inset-inline-end: 50%;
      transform: translateX(-50%);
      z-index: 1001;
      color: black;
      background-color: rgba(255, 255, 255, 0.8);
      padding: em(5px);
      border-radius: em(5px);
      .toggle-btns {
        flex-wrap: nowrap;
      }
    }
  }
}
</style>
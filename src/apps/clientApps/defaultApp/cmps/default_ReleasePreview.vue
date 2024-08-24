<template>
  <router-link :to="{ name: 'ReleaseDetails', params: {id: release._id} }">
    <li class="release-preview flex column gap10">
        <img v-if="releaseData.mainImage.src" :src="imgToShow" :alt="releaseData.title">
        <h3 class="title" :title="releaseData.title" v-if="releaseData.title">{{shrtenTitle}}</h3>
        <p :title="fullDescStr" v-if="shortenDesc">{{shortenDesc}}</p>
    </li>
  </router-link>
</template>

<script>
import { htmlStrToText } from '@/apps/common/modules/common/services/util.service';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
import { cropText } from '@/apps/common/modules/common/services/util.service';
export default {
  name: 'default_ReleasePreview',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  computed: {
    release() {
      return this.item
    },
    releaseData() {
      return this.release.releaseData;
    },

    fullDescStr() {
      return htmlStrToText(this.releaseData.content);
    },
    shortenDesc() {
      return cropText(this.fullDescStr, 100);
      // const content = this.fullDescStr;
      // if (content.length <= 100) return content;
      // return content.substring(0, 100) + '...';
    },

    shrtenTitle() {
      const title = this.releaseData.title;
      if (title.length <= 22) return title;
      return title.substring(0, 22) + '...';
    },

    imgToShow() {
      return fixFileSrcToThumbnail(this.releaseData.mainImage);
    }
  }
}
</script>


<style lang="scss">
@import '@/assets/styles/global/index';
.defaultApp {
  .release-preview {
    position: relative;
    width: 220px;
    img {
      height: 160px;
      width: 100%;
      object-fit: contain;
      // object-fit: cover;
      background-color: rgb(255, 255, 255);
    }
  
    // h3 {
    //   color: $layout-red;
    // }
  }
}
</style>
<template>
  <router-link :to="{ name: 'ReleaseDetails', params: {id: release._id} }">
    <li class="release-preview flex column gap10">
        <img v-if="releaseData.mainImage?.[0]" :src="imgToShow" :alt="releaseData.title">
        <h3 class="title" :title="releaseData.title" v-if="releaseData.title">{{shrtenTitle}}</h3>
        <p :title="fullDescStr" v-if="shortenDesc">{{shortenDesc}}</p>
    </li>
  </router-link>
</template>

<script>
import { htmlStrToText } from '@/apps/common/modules/common/services/util.service';
import { fixFileSrcToThumbnail } from '../../../../../common/modules/common/services/file.service';
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
      return htmlStrToText(this.releaseData.desc);
    },
    shortenDesc() {
      const desc = this.fullDescStr;
      if (desc.length <= 100) return desc;
      return desc.substring(0, 100) + '...';
    },

    shrtenTitle() {
      const title = this.releaseData.title;
      if (title.length <= 22) return title;
      return title.substring(0, 22) + '...';
    },

    imgToShow() {
      return fixFileSrcToThumbnail(this.releaseData.mainImage[0].src);
    }
  }
}
</script>


<style lang="scss">
@import '@/assets/styles/global/index';
.default-app {
  .release-preview {
    position: relative;
    width: 220px;
    img {
      height: 160px;
      width: 100%;
      object-fit: contain;
      // object-fit: cover;
      background-color: rgb(241, 241, 241);
    }
  
    h3 {
      color: $layout-red;
    }
  }
}
</style>
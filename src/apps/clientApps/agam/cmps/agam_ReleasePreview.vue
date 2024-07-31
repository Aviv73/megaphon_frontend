<template>
  <router-link :to="{ name: 'ReleaseDetails', params: {id: release._id} }">
    <li class="release-preview flex column gap10">
        <p v-if="releaseData.type" class="type">{{releaseData.type}}</p>
        <img v-if="releaseData.mainImage" :src="imgToShow" :alt="releaseData.title">
        <p class="sub-type" v-if="releaseData.subType">{{releaseData.subType}}</p>
        <h3 class="title" :title="releaseData.title" v-if="releaseData.title">{{shrtenTitle}}</h3>
        <div class="flex column gap10">
          <p v-if="releaseData.author">{{$t('release.by')}}: {{releaseData.author}}</p>
          <p :title="fullDescStr" v-if="shortenDesc">{{shortenDesc}}</p>
        </div>
    </li>
  </router-link>
</template>

<script>
import { htmlStrToText } from '@/apps/common/modules/common/services/util.service';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
export default {
  name: 'agam_ReleasePreview',
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
      return fixFileSrcToThumbnail(this.releaseData.mainImage.src);
    }
  }
}
</script>


<style lang="scss">
@import '@/assets/styles/global/index';
.agam-app {
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
    
    .type {
      position: absolute;
      background-color: white;
      top: 0;
      left: -10px;
      transform: translateY(-50%);
      color: $layout-red;
      border: 1px solid $layout-red;
      border-radius: 14px;
      padding: 5px 12px;
      font-weight: bold;;
    }
  }
}
</style>
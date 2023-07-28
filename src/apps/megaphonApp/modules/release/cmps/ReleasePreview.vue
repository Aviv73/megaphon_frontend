<template>
  <li class="release-preview">
    <img class="release-img" :src="imgSrc" alt="">
    <p>{{release.title}}</p>
    <div class="actions flex column gap5">
      <button @click="goToLandingPage"><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/eye.svg')" alt=""></button>
      <router-link :to="{ name: 'ReleaseEdit', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/pencil.svg')" alt=""></router-link>
      <!-- <router-link :to="{ name: 'ReleaseStats', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/stats.svg')" alt=""></router-link> -->
      <router-link :to="{ name: 'ReleaseDistribution', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/distribute.svg')" alt=""></router-link>
    </div>
  </li>
</template>

<script>
import { getReleaseLandingPageUrl } from '../../common/services/template.util.service';
export default {
  name: 'ItemPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String]
  },
  computed: {
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    release() {
      return this.item.releaseData
    },
    imgSrc() {
      return this.release.mainImage?.[0]?.src || require('@/apps/megaphonApp/assets/images/image_placeholder.png');
    }
  },
  methods: {
    goToLandingPage() {
      const pageUrl = getReleaseLandingPageUrl(this.item, this.organization);
      window.open(pageUrl);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-preview {
    position: relative;
    width: em(160px);
    .release-img {
      height: em(110px);
      width: 100%;
      object-fit: cover;
    }
    p {
      word-wrap: break-word;
    }

    .actions {
      position: absolute;
      top: em(10px);
      left: em(10px);
      a, button {
        background-color: #fff;
        width: em(17px);
        height: em(17px);
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
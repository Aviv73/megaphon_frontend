<template>
  <section class="group-release-details flex column gap30 height-all">
    <!-- <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${(fixFileSrcToThumbnail(release.mainImage.src))}')`, 'background-size': 'cover' }"> -->
    <ReleasesSlider :releases="releaseData.childrenReleases"/>
    <div class="inner-container flex column gap30">
      <h1>{{releaseData.title}}</h1>
      <h5>{{releaseData.subTitle}}</h5>
      <p v-if="monthPublish">{{$t('releaseData.monthPublish')}}: {{monthPublish}}</p>
      <div v-html="releaseData.content"></div>
      <ItemList
        class="flex-1"
        :items="releaseData.childrenReleases"
        itemDetailesPageName="ReleaseDetails"
        :singlePreviewCmp="ReleasePreview"
      />
      <FilesSection :release="release"/>
    </div>
  </section>
</template>

<script>
import ItemList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemList.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue'
// import ReleasePreview from '../cmps/streamTv_ReleasePreview.vue'
import ReleasePreview from '@/apps/common/modules/release/cmps/common_ReleasePreview.vue'
import FilesSection from '@/apps/common/modules/release/cmps/FilesSection.vue'
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service'
import ReleasesSlider from '../../../common/modules/release/cmps/ReleasesSlider.vue'

export default {
  name: 'streamTv_GroupReleaseDetails',
  components: { ItemList, ReleasePreview, ItemSearchList, FilesSection, ReleasesSlider },
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  data() {
    return { 
      ReleasePreview
    }
  },
  computed: {
    monthPublish() {
      if (!this.release.publishedAt) return '';
      const at = new Date(this.release.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      if (isNaN(year)) return '';
      const pretyMont = this.$t('months.'+month);
      return `${pretyMont} ${year}`;
    },
    releaseData() {
      return this.release.releaseData;
    }
  },
  methods: {
    fixFileSrcToThumbnail
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '../assets/style/index';
.streamTv-app {
  .group-release-details {
    padding-bottom: $main-pad-y;
  
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }

    
    @media (max-width: $small-screen-breake) {
      .hero {
        gap: em(5px);
        width: 98% !important;
        
      }
      .hero-main {
        flex: 1;
        flex-wrap: wrap;
        padding: em(15px) !important;
      }
      .arrow-btn {
        width: em(100px);
        height: em(100px);
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .release-hero-view {
        padding: em(5px);
        width: 100%;
      }
    }

  }
}
</style>
<template>
  <section class="group-release-details flex column gap30 height-all">
    <!-- <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${(fixFileSrcToThumbnail(release.mainImage.src))}')`, 'background-size': 'cover' }"> -->
    <ReleasesSlider :title="$t('release.monthlyRecommendation')" :releases="recommendedReleases?.length ? recommendedReleases : releaseData.childrenReleases"/>
    <div class="inner-container_ flex column gap30">
      <div class="items-section" v-if="mostWatchedReleases?.length">
        <div class="headline">
          <h3>{{$t('release.mostWatched')}}</h3>
        </div>
        <ItemList
          class="flex-1"
          :items="mostWatchedReleases"
          itemDetailesPageName="ReleaseDetails"
          :singlePreviewCmp="ReleasePreview"
        />
      </div>
      <div class="items-section">
        <div class="headline">
          <h3>{{$t('release.newReleases')}}</h3>
        </div>
        <ItemList
          class="flex-1"
          :items="releaseData.childrenReleases"
          itemDetailesPageName="ReleaseDetails"
          :singlePreviewCmp="ReleasePreview"
        />
      </div>
      <div class="items-section">
        <div class="headline">
          <h3>{{$t('archive')}}</h3>
        </div>
        <ul class="archive-section flex align-center-wrap-justify-center gap20">
          <li v-for="release in archiveReleases" :key="release._id">
            <router-link :to="{name: 'ReleaseDetails', params: { id: release._id } }">
              {{release.releaseData.title}}
            </router-link>
          </li>
        </ul>
        
      </div>
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
    },

    archiveReleases() {
      console.log(this.$store.getters['release/archiveReleases']?.items || []);
      return this.$store.getters['release/archiveReleases']?.items || [];
    },

    mostWatchedReleases() {
      return this.releaseData.mostWatchedReleases?.map(c => this.releaseData.childrenReleases.find(_ => _._id === c)) || [];
    },
    recommendedReleases() {
      return this.releaseData.recommendedReleases?.map(c => this.releaseData.childrenReleases.find(_ => _._id === c)) || [];
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
  
    max-width: 100%;
    width: 100%;
    .items-section {
      display: flex;
      flex-direction: column;
      gap: em(20px);
      max-width: 100%;
      width: 100%;
      .headline {
        --headcolor: black;
        display: flex;
        align-items: center;
        gap: em(10px);
        padding: 0 0 0 em(20px);
        &::after {
          content: "";
          flex: 1;
          height: 0;
          border-bottom: em(0.5px) solid var(--heading-color);
        }
      }
      .item-list {
        justify-content: flex-start;
        // flex-wrap: nowrap;
        gap: em(10px);
        max-width: 100%;
        overflow-x: auto;
      }
    }

    .costume-title {
      border-bottom: 1px solid white;
      padding-bottom: em(10px);
      width: 100%;
    }

    .archive-section {
      a {
        display: inline-block;
        background-color: var(--heading-color);
        padding: em(15px) em(20px);
        color: white;
        border-radius: em(8px);
        font-size: $font-size-big;
        width: em(150px);
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }


    // .item-page {
    //   overflow: unset;
    //   .item-list {
    //     overflow-y: unset;
    //   }
    // }

    
    // @media (max-width: $small-screen-breake) {
    //   .hero {
    //     gap: em(5px);
    //     width: 98% !important;
        
    //   }
    //   .hero-main {
    //     flex: 1;
    //     flex-wrap: wrap;
    //     padding: em(15px) !important;
    //   }
    //   .arrow-btn {
    //     width: em(100px);
    //     height: em(100px);
    //     img {
    //       width: 100%;
    //       height: 100%;
    //       object-fit: contain;
    //     }
    //   }

    //   .release-hero-view {
    //     padding: em(5px);
    //     width: 100%;
    //   }
    // }

  }
}
</style>
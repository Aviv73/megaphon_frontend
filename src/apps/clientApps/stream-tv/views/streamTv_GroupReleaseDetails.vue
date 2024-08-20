<template>
  
  <section class="group-release-details flex column gap20 height-all">
    <!-- <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${(fixFileSrcToThumbnail(release.mainImage.src))}')`, 'background-size': 'cover' }"> -->
    <ReleasesSlider :title="$t('release.monthlyRecommendation')" :releases="recommendedReleases?.length ? recommendedReleases : releaseData.childrenReleases"/>
    <div class="page-like-section container flex column gap50" v-if="tabName === 'monthlySummary'">
      <!-- <h2>{{$t('release.monthlySummary')}}</h2> -->
      <ul class="flex column gap30">
        <li class="release-summary-preview flex gap10" v-for="release in releaseData.childrenReleases.filter(c => c.releaseData?.mainImage?.src)" :key="release._id">
          <div class="flex-1 summery-image_">
            <img :src="release.releaseData.mainImage?.src"/>
          </div>
          <div class="flex-2 flex column gap10 space-between">
            <div class="flex column gap10">
              <h3>{{release.releaseData.title}}</h3>
              <p v-html="release.releaseData.content"></p>
            </div>
            <router-link class="underline bold clr-4" :to="{name: 'ReleaseDetails', params: {id: release._id} }">{{$t('toDetails')}}</router-link>
          </div>
        </li>
      </ul>
    </div>
    <div class="page-like-section container flex column gap50" v-else-if="tabName === 'broadcastTimes'">
      <!-- <h2>{{$t('release.broadcastTimes')}}</h2> -->
    </div>
    <div class="page-like-section container width-all flex column gap50" v-else-if="tabName === 'archive'">
      <!-- <h2>{{$t('release.archive')}}</h2> -->
      <ul class="archive-section flex align-center-wrap-justify-center gap20">
          <li v-for="release in archiveReleases" :key="release._id">
            <router-link :to="{name: 'ReleaseDetails', params: { id: release._id } }">
              {{release.releaseData.title}}
            </router-link>
          </li>
        </ul>
    </div>
    <div v-else class="inner-container_ flex column gap10">
      <!-- <ReleasesSlider :title="$t('release.monthlyRecommendation')" :releases="recommendedReleases?.length ? recommendedReleases : releaseData.childrenReleases"/> -->
      <div class="items-section" v-if="mostWatchedReleases?.length">
        <div class="headline">
          <div class="img" v-html="icons.eye"></div>
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
          <div class="img" v-html="icons.new"></div>
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
          <div class="img" v-html="icons.archive"></div>
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
import ItemList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemList.vue';
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
// import ReleasePreview from '../cmps/streamTv_ReleasePreview.vue';
import ReleasePreview from '@/apps/common/modules/release/cmps/common_ReleasePreview.vue';
import FilesSection from '@/apps/common/modules/release/cmps/FilesSection.vue';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
import ReleasesSlider from '../../../common/modules/release/cmps/ReleasesSlider.vue';


import  { getSvgs } from '../assets/images/svgs.js';

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
    // monthPublish() {
    //   if (!this.release.publishedAt) return '';
    //   const at = new Date(this.release.publishedAt);
    //   const month = at.getMonth() + 1;
    //   const year = at.getFullYear();
    //   if (isNaN(year)) return '';
    //   const pretyMont = this.$t('months.'+month);
    //   return `${pretyMont} ${year}`;
    // },
    tabName() {
      // return 'summary';
      return this.$route.params.tabName;
    },
    releaseData() {
      return this.release.releaseData;
    },

    archiveReleases() {
      return this.$store.getters['release/archiveReleases']?.items || [];
    },

    mostWatchedReleases() {
      return this.releaseData.mostWatchedReleases?.map(c => this.releaseData.childrenReleases.find(_ => _._id === c)) || [];
    },
    recommendedReleases() {
      return this.releaseData.recommendedReleases?.map(c => this.releaseData.childrenReleases.find(_ => _._id === c)) || [];
    },

    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    },

    icons() {
      const clr = this.selectedTheme?.colors?.[4];
      return getSvgs(clr).icons; 
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
  .page-like-section {
    // padding-top: $main-pad-y;
    // padding: em(100px) em(20px);
    
  }
  .group-release-details {
    padding-bottom: $main-pad-y;
  
    max-width: 100%;
    width: 100%;
    .items-section {
      display: flex;
      flex-direction: column;
      gap: em(10px);
      max-width: 100%;
      width: 100%;
      .headline {
        .img, svg {
          width: em(25px);
          height: em(25px);
        }
        --headcolor: black;
        display: flex;
        align-items: center;
        gap: em(10px);
        padding: 0 0 0 em(20px);
        // padding: 0 em(10px);
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
      margin: 0 auto;
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
    
    .summery-image {
      width: unset;
      height: unset;
    }
    .release-summary-preview {
      @media (max-width: $small-screen-breake) {
        flex-direction: column;
        .flex-2 {
          flex: 1;
        }
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
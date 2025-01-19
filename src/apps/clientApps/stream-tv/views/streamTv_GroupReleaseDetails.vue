<template>
  
  <section class="group-release-details flex column gap20 height-all">
    <!-- <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${(fixFileSrcToThumbnail(releaseData.mainImage, release))}')`, 'background-size': 'cover' }"> -->
    <ReleasesSlider :title="`<div class='svg-parrent img' style='width:1.5em;height:1.5em'>${getIcons('white').recomended}</div><br/><h3>${$t('releaseModuleModule.monthlyRecommendation')}</h3>`" :releases="recommendedReleases?.length ? recommendedReleases : releaseData.childrenReleases" :getReleasePageRoute="getChildRoute"/>
    <div class="page-like-section container flex column gap20 width-all" v-if="tabName === 'monthlySummary'">
      <h2>{{$t('releaseLocales.monthlySummary')}}</h2>
      <ul class="flex column gap30">
        <li class="release-summary-preview flex gap10" v-for="cRelease in releaseData.childrenReleases" :key="cRelease._id">
          <div class="flex-1 summery-image_">
            <img :src="fixFileSrcToThumbnail(cRelease.releaseData.mainImage, cRelease)"/>
          </div>
          <div class="flex-2 flex column gap10 space-between">
            <div class="flex column gap10">
              <h3>{{cRelease.releaseData.title}}</h3>
              <p v-html="cRelease.releaseData.content"></p>
            </div>
            <router-link class="underline bold clr-4" :to="getChildRoute(cRelease)">{{$t('toDetails')}}</router-link>
          </div>
        </li>
      </ul>
    </div>
    <div class="page-like-section container flex column gap20 width-all" v-else-if="tabName === 'broadcastTimes'">
      <h2>{{$t('releaseLocales.broadcastTimes')}}</h2>
      <ul class="flex column gap30 broadcast-times-table">
        <li class="flex column gap10" v-for="cRelease in releaseData.childrenReleases.filter(c => c.releaseData.broadcastTimes?.length)" :key="cRelease._id">
          <h4>{{cRelease.releaseData.title}}</h4>
          <div class="table-like-list gap5">
            <div class="table-item-preview table-header">
              <p class="flex-1">{{$t('date')}}</p>
              <p class="flex-1">{{$t('day')}}</p>
              <p class="flex-1">{{$t('hour')}}</p>
              <p class="flex-1">{{$t('channel')}}</p>
            </div>
            <div class="table-item-preview" v-for="(bt, idx) of cRelease.releaseData.broadcastTimes" :key="idx">
              <p class="flex-1">{{bt.dateTxt}}</p>
              <p class="flex-1">{{bt.dayTxt}}</p>
              <p class="flex-1">{{bt.hourTxt}}</p>
              <p class="flex-1">{{bt.channel}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="page-like-section container width-all flex column gap20 width-all" v-else-if="tabName === 'archive'">
      <h2>{{$t('releaseLocales.archive')}}</h2>
      <ul class="archive-section flex align-center-wrap-justify-center gap20">
          <li v-for="cRelease in archiveReleases" :key="cRelease._id">
            <router-link :to="{name: 'ReleaseDetails', params: { id: cRelease._id } }">
              {{cRelease.releaseData.title}}
            </router-link>
          </li>
        </ul>
    </div>
    <div v-else class="inner-container_ flex column gap10 width-all">
      <!-- <ReleasesSlider :title="$t('releaseLocales.monthlyRecommendation')" :releases="recommendedReleases?.length ? recommendedReleases : releaseData.childrenReleases"/> -->
      <div class="items-section" v-if="mostWatchedReleases?.length">
        <div class="headline">
          <div class="img svg-parrent" v-html="icons.eye"></div>
          <h3>{{$t('releaseLocales.mostWatched')}}</h3>
        </div>
        <ItemList
          layoutMode="flex"
          class="flex-1"
          :items="mostWatchedReleases"
          itemDetailesPageName="ReleaseDetails"
          :singlePreviewCmp="ReleasePreview"
          :propsToPass="{getReleasePageRoute:getChildRoute}"
        />
      </div>
      <div class="items-section">
        <div class="headline">
          <div class="img svg-parrent" v-html="icons.new"></div>
          <h3>{{$t('releaseLocales.newReleases')}}</h3>
        </div>
        <ItemList
          layoutMode="flex"
          class="flex-1"
          :items="releaseData.childrenReleases"
          itemDetailesPageName="ReleaseDetails"
          :singlePreviewCmp="ReleasePreview"
          :propsToPass="{getReleasePageRoute:getChildRoute}"
        />
      </div>
      <div class="items-section">
        <div class="headline">
          <div class="img svg-parrent" v-html="icons.archive"></div>
          <h3>{{$t('archive')}}</h3>
        </div>
        <ul class="archive-section flex align-center-wrap-justify-center gap20">
          <li v-for="cRelease in archiveReleases" :key="cRelease._id">
            <router-link :to="{name: 'ReleaseDetails', params: { id: cRelease._id } }">
              {{cRelease.releaseData.title}}
            </router-link>
          </li>
        </ul>
        
      </div>
    </div>
  </section>
</template>

<script>
import ItemList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemList.vue';
// import ReleasePreview from '../cmps/streamTv_ReleasePreview.vue';
import ReleasePreview from '@/apps/common/modules/release/cmps/common_ReleasePreview.vue';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
import ReleasesSlider from '../../../common/modules/release/cmps/ReleasesSlider.vue';


import  { getSvgs } from '../assets/images/svgs.js';

export default {
  name: 'streamTv_GroupReleaseDetails',
  components: { ItemList, ReleasePreview, ReleasesSlider },
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
  methods: {
    fixFileSrcToThumbnail,
    getChildRoute(rel) {
      return { name: 'ReleaseDetails', params: {id: rel._id}, query: { relateTo: this.release._id } };
    },
    getIcons(clr) {
      return getSvgs(clr).icons; 
    },
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
      return this.releaseData.mostWatchedReleases?.map(c => this.releaseData.childrenReleases.find(_ => _._id === c)).filter(Boolean) || [];
    },
    recommendedReleases() {
      return this.releaseData.recommendedReleases?.map(c => this.releaseData.childrenReleases.find(_ => _._id === c)).filter(Boolean) || [];
    },

    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    },

    icons() {
      const clr = this.selectedTheme?.colors?.[4];
      return getSvgs(clr).icons; 
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '../assets/style/index';
.streamTv-app {
  max-width: 100%;
  .page-like-section {
    // padding-top: $main-pad-y;
    // padding: em(100px) em(20px);
    
  }

  .broadcast-times-table {
    max-width: rem(300px);
  }

  .hero-img {
    height: rem(500px) !important;
  }
  .hero-content {
    h2 {
      font-size: em(35px) !important;
    }
  }

  .group-release-details {
    padding-bottom: $main-pad-y;
    max-width: calc(100vw - var(--aside-width));
    @media (max-width: $small-screen-break) {
      max-width: 100vw;
    }
    width: 100%;
    .items-section {
      display: flex;
      flex-direction: column;
      gap: em(10px);
      max-width: 100%;
      width: 100%;
      .headline {
        .img {
          width: em(25px);
          height: em(25px);
        }
        --headcolor: black;
        display: flex;
        align-items: center;
        gap: em(10px);
        padding: 0 0 0 em(20px);
        // padding: 0 em(10px);
        // &::after {
        //   content: "";
        //   flex: 1;
        //   height: 0;
        //   border-bottom: em(0.5px) solid var(--heading-color);
        // }
      }
      .item-list {
        justify-content: flex-start;
        gap: em(10px);
        
        max-width: 100%;
        flex-wrap: nowrap;
        overflow-y: unset;
        overflow-x: auto;

        @include prettyScroll;
        &::-webkit-scrollbar {
          // height: 0;
          // visibility: hidden;
        }
      }
    }

    .costume-title {
      border-bottom: 1px solid rgba(255, 255, 255, 0.8);
      padding-bottom: em(10px);
      width: 100%;
    }

    .archive-section {
      margin: 0 auto;
      a {
        display: inline-block;
        background-color: var(--heading-color);
        padding: em(15px) em(20px);
        color: var(--clr-1);
        border-radius: em(8px);
        font-size: $font-size-big;
        // width: em(150px);
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
      @media (max-width: $small-screen-break) {
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

    
    // @media (max-width: $small-screen-break) {
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
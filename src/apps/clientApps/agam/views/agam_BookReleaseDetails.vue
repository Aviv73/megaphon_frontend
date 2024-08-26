<template>
  <section v-if="release" class="book-release-details inner-container main-pad-y flex column gap50">
    <RoutesLocator :links="[
      {label: $t('main'), to: {name: 'ReleasePage'}/*$store.getters.mainLinkRouteTo*/ },
      {label: releaseData.type, to: {name: 'ReleasePage', query: {'filter_params_type': releaseData.type, page: 'book'} } },
      {label: releaseData.subType, to: {name: 'ReleasePage', query: {'filter_params_subType': releaseData.subType, page: 'book'} } },
      {label: releaseData.title, to: {name: 'ReleaseDetails', params: { id: release._id} }, disabled: true },
    ]"/>
    <h1>{{releaseData.title}}</h1>
    <div class="main-content-section flex-1 flex space-between gap60 wrap">
      <img class="main-img" :src="fixFileSrcToThumbnail(releaseData.mainImage, release)" :alt="releaseData.title"/>
      <div class="hero-content flex column align-start gap15">
        <div class="description-container" v-if="releaseData.content" v-html="releaseData.content"></div>
        <div class="flex gap60 links">
          <h3>{{$t('release.main')}}<hr/></h3>
          
          <router-link target="_blank" v-if="fixFileSrcToThumbnail(releaseData.firstChapterLink, release)" :to="{name: 'FileViewer', query: {file: fixFileSrcToThumbnail(releaseData.firstChapterLink, release) } }"><h3>{{$t('release.firstChapter')}}</h3></router-link>
          <router-link target="_blank" v-if="fixFileSrcToThumbnail(releaseData.comunicatLink, release)" :to="{name: 'FileViewer', query: {file: fixFileSrcToThumbnail(releaseData.comunicatLink, release) } }"><h3>{{$t('release.comunicat')}}</h3></router-link>

        </div>
        <div class="table-like">
          <div class="row" v-if="releaseData.author"><p>{{$t('release.by')}}</p><p>{{releaseData.author}}</p></div>
          <div class="row" v-if="releaseData.painter"><p>{{$t('release.paint')}}</p><p>{{releaseData.painter}}</p></div>
          <div class="row" v-if="releaseData.translator"><p>{{$t('release.translator')}}</p><p>{{releaseData.translator}}</p></div>
          <div class="row" v-if="releaseData.pageCount"><p>{{$t('release.pageCount')}}</p><p>{{releaseData.pageCount}}</p></div>
          <div class="row" v-if="releaseData.forAgeMax || releaseData.forAgeMin"><p>{{$t('release.forAge')}}</p><p>{{releaseData.forAgeMax || 99}} - {{releaseData.forAgeMin || 0}}</p></div>
          <div class="row" v-if="monthPublish"><p>{{$t('release.monthPublish')}}</p><p>{{monthPublish}}</p></div>
          <div class="row" v-if="releaseData.price"><p>{{$t('release.price')}}</p><p>{{releaseData.price}}</p></div>
        </div>
      </div>
    </div>
    <div v-if="fixVideoSrcToThumbnail(releaseData.videos[0], release, release.organizationId)" class="video-section flex column gap30">
      <h2>{{releaseData.videos[0].title}}</h2>
      <!-- <iframe :src="fixVideoSrcToThumbnail(releaseData.videos[0], release, release.organizationId)"></iframe> -->
      <video controls :src="fixVideoSrcToThumbnail(releaseData.videos[0], release, release.organizationId)"></video>
    </div>
  </section>
</template>

<script>
import { fixFileSrcToThumbnail, fixVideoSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
import RoutesLocator from '../cmps/agam_RoutesLocator.vue';

export default {
  components: { RoutesLocator },
  name: 'agam_BookReleaseDetails',
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  methods: {
    fixFileSrcToThumbnail, fixVideoSrcToThumbnail
  },
  computed: {
    monthPublish() {
      const at = new Date(this.releaseData.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      const pretyMont = this.$t('months.'+month);
      return `${pretyMont} ${year}`;
      return this.releaseData.publishedAt;
    },

    releaseData() {
      return this.release.releaseData;
    }

    // initReleaseId() {
    //   return this.$store.getters['release/initReleaseId'];
    // },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.agam-app {
  .book-release-details {
    .main-content-section {
      height: 100%;
      
      .links {
        width: 100%;
        border-bottom: 2px solid lighten($layout-red, 30%);
        >* {
          padding: 5px;
          &:not(:first-child) {
            h3 {
              color: $layout-black;
            }
          }
          &:first-child {
            // border-bottom: 4px solid $layout-red;
          }
          position: relative;
          hr {
            margin: 0;
            position: absolute;
            bottom: -3px;
            right: 50%;
            transform: translateX(50%);
            width: 95%;
            height: 4px;
            background-color: $layout-red;
            border: 0;
  
          }
        }
      }
  
      .main-img {
        height: 100%;
        // width: auto;
        width: 30%;
        object-fit: contain;
        background-color: rgb(255, 216, 216);
        // flex: 1;
        // flex-grow: 1;
        margin: 0 auto;
      }
  
      .hero-content {
        flex: 1;
        // flex-grow: 3;
      }
  
      .description-container {
        line-height: 1.3em;
      }
  
      .table-like {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 7.5px;
        .row {
          padding: 7.5px;
          display: flex;
          gap: em(5px);
          >:first-child {
            flex: 2;
          }
          >:nth-child(2) {
            flex: 5;
          }
          &:not(:last-child) {
            border-bottom: 2px solid rgba(83, 83, 83, 0.2);
          }
        }
      }

      
      @media (max-width: $small-screen-breake) {
        flex-direction: column;
        .main-img {
          width: 80%;
        }

        .table-like {
          .row {
            >:first-child {
              flex: 1;
            }
            >:nth-child(2) {
              flex: 1;
            }
          }
        }
      }


  
      // {
      //   .hero-content, .main-img {
      //     flex: unset;
      //     width: 100%;
      //   }
      // }

    }
  
  
    iframe, video {
      box-shadow: $light-shadow;
      height: 600px;
      width: 100%;
    }
  }
}
</style>
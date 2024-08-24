<template>
  <section v-if="release" class="book-release-details inner-container main-pad-y flex column gap50">
    <RoutesLocator :links="[
      {label: $t('main'), to: {name: 'ReleasePage'}/*$store.getters.mainLinkRouteTo*/ },
      {label: release.type, to: {name: 'ReleasePage', query: {'filter_params_type': release.type, page: 'book'} } },
      {label: release.subType, to: {name: 'ReleasePage', query: {'filter_params_subType': release.subType, page: 'book'} } },
      {label: release.title, to: {name: 'ReleaseDetails', params: { id: release._id} }, disabled: true },
    ]"/>
    <h1>{{release.title}}</h1>
    <div class="main-content-section flex-1 flex space-between gap60 wrap">
      <img class="main-img" :src="fixFileSrcToThumbnail(release.mainImage)" :alt="release.title"/>
      <div class="hero-content flex column align-start gap15">
        <div class="description-container" v-if="release.content" v-html="release.content"></div>
        <div class="flex gap60 links">
          <h3>{{$t('release.main')}}<hr/></h3>
          <!-- <a target="_blank" v-if="release.firstChapterLink?.[0]?.src" :href="release.firstChapterLink[0].src"><h3>{{$t('release.firstChapter')}}</h3></a>
          <a target="_blank" v-if="release.comunicatLink?.[0]?.src" :href="release.comunicatLink[0].src"><h3>{{$t('release.comunicat')}}</h3></a> -->
          
          <router-link target="_blank" v-if="release.firstChapterLink?.src" :to="{name: 'FileViewer', query: {file: fixFileSrcToThumbnail(release.firstChapterLink) } }"><h3>{{$t('release.firstChapter')}}</h3></router-link>
          <router-link target="_blank" v-if="release.comunicatLink?.src" :to="{name: 'FileViewer', query: {file: fixFileSrcToThumbnail(release.comunicatLink) } }"><h3>{{$t('release.comunicat')}}</h3></router-link>

        </div>
        <div class="table-like">
          <div class="row" v-if="release.author"><p>{{$t('release.by')}}</p><p>{{release.author}}</p></div>
          <div class="row" v-if="release.painter"><p>{{$t('release.paint')}}</p><p>{{release.painter}}</p></div>
          <div class="row" v-if="release.translator"><p>{{$t('release.translator')}}</p><p>{{release.translator}}</p></div>
          <div class="row" v-if="release.pageCount"><p>{{$t('release.pageCount')}}</p><p>{{release.pageCount}}</p></div>
          <div class="row" v-if="release.forAgeMax || release.forAgeMin"><p>{{$t('release.forAge')}}</p><p>{{release.forAgeMax || 99}} - {{release.forAgeMin || 0}}</p></div>
          <div class="row" v-if="monthPublish"><p>{{$t('release.monthPublish')}}</p><p>{{monthPublish}}</p></div>
          <div class="row" v-if="release.price"><p>{{$t('release.price')}}</p><p>{{release.price}}</p></div>
        </div>
      </div>
    </div>
    <div v-if="release.videos?.[0]?.src" class="video-section flex column gap30">
      <h2>{{release.videos[0].title}}</h2>
      <!-- <iframe :src="release.video.src"></iframe> -->
      <video controls :src="fixVideoSrcToThumbnail(release.videos[0])"></video>
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
      const at = new Date(this.release.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      const pretyMont = this.$t('months.'+month);
      return `${pretyMont} ${year}`;
      return this.release.publishedAt;
    },

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
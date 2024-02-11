<template>
  <section v-if="release" class="simple-release-details inner-container main-pad-y flex align-start gap50">
    <div class="release-page-nav wide-screen-item sticky flex column gap10">
      <!-- :style="{position: 'fixed', top: '110px'}" -->
      <template v-for="tabName in ['content', 'images', 'videos', 'files', 'links']">
        <a
          :key="tabName"
          :class="{bold: selectedTab === tabName}" 
          @click="scrollToEl(tabName)"
          v-if="typeof release[tabName] === 'string'? true : release[tabName]?.filter(c => c.src).length"
        >
          {{$t(`release.${tabName}`)}}
        </a>
      </template>
      <!-- <a :class="{selected: selectedTab === ''}" @click="scrollToEl('links')" v-if="release.links.filter(c => c.src).length">{{$t('release.links')}}</a> -->
    </div>
    <div class="content-section flex column gap30">
      <h1>{{release.title}}</h1>
      <h5>{{release.subTitle}}</h5>
      <div class="main-content-section flex-1 flex wrap space-between gap60">
        <img class="main-img" :src="release.mainImage.src" :alt="release.title"/>
        <div id="content" class="hero-content flex column align-start gap15">
          <div class="description-container" v-if="release.content" v-html="release.content"></div>
          <p v-if="monthPublish">{{$t('release.monthPublish')}}: {{monthPublish}}</p>
        </div>
      </div>

      <FilesSection :release="release"/>
    </div>
  </section>
</template>

<script>
import { fixFileSrcToThumbnail } from '../../../../../common/modules/common/services/file.service';
import { scrollToEl } from '../../../../../common/modules/common/services/util.service';
import FilesSection from '../cmps/FilesSection.vue';

export default {
  components: { FilesSection },
  name: 'default_SimpleReleaseDetails',
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedTab: ''
    }
  },
  methods: {
    fixFileSrcToThumbnail
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

    initReleaseId() {
      return this.$store.getters['release/initReleaseId'];
    },
  },
  methods: {
    scrollToEl(elId) {
      this.selectedTab = elId;
      return scrollToEl(`#${elId}`, -20);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.default-app {
  .simple-release-details {
    .release-page-nav {
      height: fit-content;
      top: em(10px);
    }
    .content-section {
      height: fit-content;
    }
    .main-content-section {
      height: 100%;
      
      // .links {
      //   width: 100%;
      //   // border-bottom: 2px solid lighten($layout-red, 30%);
      //   >* {
      //     padding: 5px;
      //     &:not(:first-child) {
      //       h3 {
      //         // color: $layout-black;
      //       }
      //     }
      //     &:first-child {
      //       // border-bottom: 4px solid $layout-red;
      //     }
      //     position: relative;
      //     hr {
      //       margin: 0;
      //       position: absolute;
      //       bottom: -3px;
      //       right: 50%;
      //       transform: translateX(50%);
      //       width: 95%;
      //       height: 4px;
      //       background-color: $layout-red;
      //       border: 0;
  
      //     }
      //   }
      // }
  
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
  
      // .table-like {
      //   width: 100%;
      //   display: flex;
      //   flex-direction: column;
      //   gap: 7.5px;
      //   .row {
      //     padding: 7.5px;
      //     display: flex;
      //     gap: em(5px);
      //     >:first-child {
      //       flex: 2;
      //     }
      //     >:nth-child(2) {
      //       flex: 5;
      //     }
      //     &:not(:last-child) {
      //       border-bottom: 2px solid rgba(83, 83, 83, 0.2);
      //     }
      //   }
      // }

      
      @media (max-width: $small-screen-breake) {
        flex-direction: column;
        .main-img {
          width: 80%;
        }

        // .table-like {
        //   .row {
        //     >:first-child {
        //       flex: 1;
        //     }
        //     >:nth-child(2) {
        //       flex: 1;
        //     }
        //   }
        // }
      }


  
      // {
      //   .hero-content, .main-img {
      //     flex: unset;
      //     width: 100%;
      //   }
      // }

    }
  
  
    iframe, video, .media-item {
      box-shadow: $light-shadow;
      height: 600px;
      width: 100%;
    }
  }
}
</style>
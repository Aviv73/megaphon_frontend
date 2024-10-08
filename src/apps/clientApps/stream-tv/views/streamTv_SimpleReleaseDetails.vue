<template>
  <section v-if="release" class="simple-release-details flex column gap30">
    <img class="hero-img" :src="fixFileSrcToThumbnail(release.releaseData.mainImage, release)" :alt="release.title"/>
    <div class="inner-container flex column space-between flex-1 gap30">
      <ReleaseTabView :release="release" :tabView="true" :hideTabs="hideTabs" :mapTabs="mapTabs">
        <!-- <router-link v-if="!isDirectMode" :to="{ name: 'DirectReleaseDetails', params: {id: $route.params.id} }" target="_blank" class="tab-link align-self-end">
          {{$t('directLink')}}
        </router-link> -->
      </ReleaseTabView>
      <router-link v-if="!isDirectMode" :to="{ name: 'DirectReleaseDetails', params: {id: $route.params.id} }" target="_blank" class="small-screen-item_ clr-4 underline bold align-self-end">
        {{$t('directLink')}}
      </router-link>
      <!-- <div class="ph"></div> -->
      <div class="ph"></div>
    </div>
    <router-link v-if="lastSeenGroupRelease" :to="{ name: 'ReleaseDetails', params: {id: lastSeenGroupRelease._id} }">
      <button class="back-btn"> 
        <div class="img svg-parrent" v-html="arrowImg"></div>
      </button>
    </router-link>
  </section>
</template>

<script>
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
import ReleaseTabView from '../../../common/modules/release/cmps/ReleaseTabView.vue';

import  { getSvgs } from '@/assets/images/svgs.js';
export default {
  components: { ReleaseTabView },
  name: 'streamTv_SimpleReleaseDetails',
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  methods: {
    fixFileSrcToThumbnail,
    
    mapTabs(tab) {
      if (tab === 'comunicat') {
        console.log({type: 'fileViewer', url: fixFileSrcToThumbnail(this.release.releaseData.comunicatFile, this.release)});
        return {type: 'fileViewer', url: fixFileSrcToThumbnail(this.release.releaseData.comunicatFile, this.release)};}
      return {};
    }
  },
  computed: {
    lastSeenGroupRelease() {
      return this.$store.getters['release/lastSeenGroupRelease'];
    },
    arrowImg() {
      return getSvgs('black').arrowDown;
    },

    isDirectMode() {
      return this.$route.name === 'DirectReleaseDetails';
    },

    hideTabs() {
      if (this.isDirectMode) return ['videos', 'watch'];
      return [];
    }
  },
  async created() {
    if (this.$route.query.relateTo && !this.lastSeenGroupRelease) {
      const fatherRelease = await this.$store.getters['release/service'].get(this.$route.query.relateTo, this.$store.getters['release/organizationId']);
      this.$store.commit({ type: 'release/setLastSeenGroupRelease', release: fatherRelease });
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .simple-release-details {


    .hero-img {
      width: 100%;
      // height: em(500px);
      height: 70vh;
      object-position: center center;
    }

    .mainImage-display {
      display: none;
    }

    .tags-display {
      color: var(--heading-color);
      border-bottom: em(1px) solid var(--heading-color);
      padding-bottom: em(15px);
      .field-title {
        display: none;
      }
      .tag-lest {
        gap: 0;
        span {
          padding: 0 em(15px);
          &:not(:last-child) {
            border-inline-end: 2px solid var(--clr-4);
          }
        }
      }
    }

    .type-display, .licenseType-display {
      .dynamic-field {
        .field-title {
          color: var(--clr-0);
        }
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: em(10px);
      }
    }

    .publishedAt-display {
      display: none;
      color: var(--heading-color);
      border-bottom: em(1px) solid var(--heading-color);
      border-top: em(1px) solid var(--heading-color);
      padding-bottom: em(15px);
      padding-top: em(15px);
      .field-title {
        display: none;
      }
    }

    .images-display {
      .file-preview {
        h5 {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .img-file-preview {
          border-radius: em(8px);
          box-shadow: $light-shadow;
          // background-color: unset;
        }
        .img-actions {
          // bottom: unset;
          // top: em(10px);
          bottom: em(170px);
          .download-btn {
            height: em(20px);
            width: em(20px);
            background-color: unset !important;
            border: unset;
            position: relative;
            span {
              display: none;
            }
            &::after {
              content: "";
              background: url("~@/assets/images/icons/download-button-white.svg") no-repeat center center;
              background-size: contain;
              display: block;
              width: em(20px);
              height: em(20px);
              top: 0;
              left: 0;
              position: absolute;
              z-index: 1;
            }
          }
        }
      }
    }

    .broadcastTimesText-display {
      color: var(--clr-4);
      border-bottom: em(1px) solid var(--heading-color);
      border-top: em(1px) solid var(--heading-color);
      padding-bottom: em(15px);
      padding-top: em(15px);
    }

    // .content-display {
    // }

    .back-btn {
      width: em(50px);
      height: em(50px);
      background-color: #fff;
      box-shadow: $light-shadow;
      position: fixed;
      top: 50%;
      right: em(10px);
      transform: translateY(-50%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: rem(25px);
        height: rem(25px);
        transform: rotate(-90deg) translateY(#{rem(2px)});
      }
    }
  }
}
</style>
<template>
  <section v-if="release" class="simple-release-details flex column gap50">
    <img class="hero-img" :src="fixFileSrcToThumbnail(release.releaseData.mainImage.src)" :alt="release.title"/>
    <div class="inner-container flex column space-between flex-1 gap30">
      <ReleaseTabView :release="release" :tabView="true"/>
      <!-- <div class="ph"></div> -->
      <router-link :to="{ name: 'ReleaseDetails', params: {id: $route.params.id} }" target="_blank" class="clr-4 underline bold align-self-end">
        {{$t('directLink')}}
      </router-link>
      <div class="ph"></div>
    </div>
  </section>
</template>

<script>
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
import ReleaseTabView from '../../../common/modules/release/cmps/ReleaseTabView.vue';

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
    fixFileSrcToThumbnail
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .simple-release-details {
    .hero-img {
      width: 100%;
      height: em(300px);
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
    }

    .publishedAt-display {
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
  }
}
</style>
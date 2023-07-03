<template>
  <section class="book-release-details inner-container main-pad-y flex column gap50">
    <!-- <RoutesLocator :links="[
      {label: $t('main'), to: $store.getters.mainLinkRouteTo },
      {label: release.type, to: {name: 'ReleasePage', query: {'filter_params_type': release.type} } },
      {label: release.subType, to: {name: 'ReleasePage', query: {'filter_params_subType': release.subType} } },
      {label: release.title, to: {name: 'ReleaseDetails', params: { id: release._id} }, disabled: true },
    ]"/> -->
    <h1>{{release.title}}</h1>
    <div class="main-content-section flex-1 flex space-between gap60">
      <img class="main-img" :src="release.mainImage[0].src" :alt="release.title"/>
      <div class="hero-content flex column align-start gap15">
        <div class="flex gap60 links">
          <h3>{{$t('release.main')}}<hr/></h3>
        </div>
        <div class="description-container" v-html="release.desc"></div>
      </div>
    </div>
    <div v-if="release.video" class="video-section flex column gap30">
      <h2>{{release.video.title}}</h2>
      <!-- <iframe :src="release.video.src"></iframe> -->
      <video controls :src="release.video[0].src"></video>
    </div>
  </section>
</template>

<script>
import RoutesLocator from '../cmps/RoutesLocator.vue';
export default {
  components: { RoutesLocator },
  name: 'BookReleaseDetails',
  props: {
    release: {
      type: Object,
      required: true
    }
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

    initReleaseId() {
      return this.$store.getters['release/initReleaseId'];
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
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
        >:first-child {
          flex: 1;
        }
        >:nth-child(2) {
          flex: 3;
        }
        &:not(:last-child) {
          border-bottom: 2px solid rgba(83, 83, 83, 0.2);
        }
      }
    }

  }


  iframe, video {
    box-shadow: $light-shadow;
    height: 600px;
    width: 100%;
  }
}
</style>
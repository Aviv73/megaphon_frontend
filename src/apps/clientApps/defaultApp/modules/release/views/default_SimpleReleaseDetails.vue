<template>
  <section class="book-release-details inner-container main-pad-y flex column gap50">
    <img class="main-img" :src="release.mainImage[0].src" :alt="release.title"/>
    <div class="main-content-section flex-1 flex column gap20">
      <h1>{{release.title}}</h1>
      <div class="description-container" v-html="release.desc"></div>
      <div class="flex gap10 mini-info-section">
        <p>
          {{release.by}}
        </p>
        <p>
          {{publishedAt}}
        </p>
      </div>
    </div>
    <div v-if="release.video" class="video-section flex column gap30">
      <h2>{{release.video.title}}</h2>
      <video controls :src="release.video[0].src"></video>
    </div>
  </section>
</template>

<script>
import RoutesLocator from '../cmps/default_RoutesLocator.vue';
export default {
  components: { RoutesLocator },
  name: 'default_SimpleReleaseDetails',
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  computed: {
    publishedAt() {
      const at = new Date(this.release.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      const day = at.getDate();
      return `${day}.${month}.${year}`;
    },

    initReleaseId() {
      return this.$store.getters['release/initReleaseId'];
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.default-app {
  .book-release-details {
    position: relative;
    .main-img {
      height: 500px;
      width: 500px;
      border-radius: 50%;
    }

    .main-content-section {
      position: absolute;
      top: 0;
      right: 50%;
      transform: translateX(50%);
      background-color: #F7F7EF;
      width: 55%;
      padding: 30px;
    }

    .description-container {
      border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      padding-bottom: 5px;
    }

    .mini-info-section {
      p:not(:last-child) {
        border-inline-end: 1px solid #9A9993;
      }
    }
  
    iframe, video {
      box-shadow: $light-shadow;
      height: 600px;
      width: 100%;
    }
  }
}
</style>
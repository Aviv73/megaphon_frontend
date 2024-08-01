<template>
  <section v-if="release" class="simple-release-details flex column gap50">
    <img class="hero-img" :src="fixFileSrcToThumbnail(release.releaseData.mainImage.src)" :alt="release.title"/>
    <ReleaseTabView :release="release" :tabView="true" class="inner-container"/>
    <div class="ph"></div>
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
      height: em(450px);
    }

    .mainImage {
      display: none;
    }
  }
}
</style>
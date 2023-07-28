<template>
  <section class="container file-viewer">
    <!-- <iframe :src="fileSrc"></iframe> -->
    <embed :src="fileSrc" type="application/pdf" />
  </section>
</template>

<script>
export default {
  name: 'FileViewer',
  computed: {
    fileSrc() {
      return (this.$route.query?.file || '') + '?embedded=true';
      // return this.$route.query?.file || '';
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.file-viewer {
  // z-index: 10000000;
  // position: fixed;
  // top: 0;
  // left: 0;
  // padding-top: em(20px) !important;
  // padding-bottom: 100px !important;
  height: calc(100vh - #{$header-height});
  width: 100vw;
  background-color: #fff;
  iframe, embed {
    height: 100%;
    width: 100%;
  }
}
</style>
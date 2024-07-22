<template>
  <section class="container file-viewer flex column">
    <!-- <iframe :src="fileSrc"></iframe> -->
    <!-- <embed :src="fileSrc" type="application/pdf" /> -->
    <!-- <object :data="fileSrc" type="application/pdf" frameborder="0">
      <embed :src="fileSrc + '?embedded=true'" type="application/pdf" />
    </object> -->
    <object :data="fileSrc" type="application/pdf" class="flex-1">
      <div class="width-all height-all flex align-center justify-center">
        <a :href="fileSrc" class="width-all text-center">
          Your web browser doesn't have a PDF plugin.
          Instead you can click here to download the PDF file.
        </a>
      </div>
    </object>
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
  iframe, object, embed {
    height: 100%;
    width: 100%;
  }
}
</style>
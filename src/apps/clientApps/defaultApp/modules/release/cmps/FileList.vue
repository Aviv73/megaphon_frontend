<template>
  <div class="files-list flex wrap align-center gap30">
    <div v-for="(file, idx) in files" :key="idx" class="flex column gap5">
      <template v-if="['video', 'img'].includes(cmpType)">
        <h2 v-if="file.title">{{file.title}}</h2>
        <p v-if="file.info">{{file.info}}</p>
      </template>
      <video
        v-if="cmpType === 'video'"
        class="video-file-preview"
        :src="fixFileSrcToThumbnail(file.src)" controls
      />
      <img
        v-else-if="cmpType === 'img'"
        class="img-file-preview"
        :src="fixFileSrcToThumbnail(file.src)" :alt="file.title"
      />
      <a
        v-else-if="cmpType === 'link'"
        class="link-file-preview"
        target="_blank" 
        :href="file.src"
      >{{file.title}}</a>
      
      <router-link
        v-else-if="cmpType === 'file'"
        class="link-file-preview"
        target="_blank" 
        :to="{name: 'FileViewer', query: {file: fixFileSrcToThumbnail(file.src) } }"
      >{{file.title}}</router-link>

    </div>
  </div>
</template>

<script>
import { fixFileSrcToThumbnail } from '../../../../../common/modules/common/services/file.service';
export default {
  name: 'FileList',
  props: {
    files: {
      type: Array
    },
    cmpType: {
      type: String,
      default: 'img'
    }
  },
  methods: {
    fixFileSrcToThumbnail
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.files-list {
  .img-file-preview {
    width: em(300px);
    height: em(200px);
  }
  .video-file-preview {
    box-shadow: $light-shadow;
    height: em(600px);
    width: 100%;
  }
  .link-file-preview {
    color: blue;
    text-decoration: underline !important;
    cursor: pointer;
  }
}
</style>
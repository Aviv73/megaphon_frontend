<template>
  <div class="files-list flex wrap align-center gap30">
    <div v-for="(file, idx) in files" :key="idx" class="flex column gap5 file-preview">
      <template v-if="['video', 'img'].includes(cmpType)">
        <h5>
          {{file.title || ''}}
        </h5>
        <div class="flex align-center gap5 wrap">
          <p v-if="file.info">{{file.info}}</p>
          <!-- <template v-if="cmpType === 'img'">
            <span v-if="file.info">|</span>
            <button class="btn clear underline" @click="downloadImg(file.src, file.title)">{{$t('download')}}</button>
          </template> -->
        </div>
      </template>
      <video
        v-if="cmpType === 'video'"
        class="video-file-preview"
        :src="fixFileSrcToThumbnail(file.src)" controls
      />
      <template v-else-if="cmpType === 'img'">
        <img
          class="img-file-preview"
          :src="fixFileSrcToThumbnail(file.src)" :alt="file.title"
        />
        <div class="img-actions flex align-center gap10">
          <button class="btn" @click="downloadImg(file.src, file.title)">{{$t('download')}}</button>
        </div>
      </template>
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
import { downloadImg } from '../../../../../common/modules/common/services/util.service';
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
    fixFileSrcToThumbnail,
    downloadImg
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
  .file-preview {
    position: relative;
  }
  .img-actions {
    position: absolute;
    left: em(10px);
    bottom: em(10px);
    .btn {
      border-radius: 0;
      border: 1px solid black;
      // width: em(50px);
      // height: em(25px);
    }
  }
}
</style>
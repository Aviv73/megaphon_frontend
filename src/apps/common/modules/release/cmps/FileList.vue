<template>
  <div class="files-list flex wrap gap20 width-all width-all">
    <div v-for="(file, idx) in files" :key="idx" class="flex column gap5 file-preview space-between" :class="{'width-all': ['video', 'iframe'].includes(cmpType), [`${cmpType}-section`]: true}">
      <template v-if="['video', 'img'].includes(cmpType)">
        <h5>
          {{file.title || ''}}
        </h5>
        <div class="flex align-center gap5 wrap">
          <p v-if="file.info">{{file.info}}</p>
          <!-- <template v-if="cmpType === 'img'">
            <span v-if="file.info">|</span>
            <button class="btn clear underline" @click="downloadImg(fixFileSrcToThumbnail(file, rootItem), file.title)">{{$t('download')}}</button>
          </template> -->
        </div>
      </template>
      <iframe
        v-if="cmpType === 'iframe'"
        class="video-file-preview"
        :src="fixFileSrcToThumbnail(file, rootItem)" controls
      />
      <VideoTag
        v-if="cmpType === 'video'"
        class="video-file-preview"
        :src="fixVideoSrcToThumbnail(file, rootItem, organizationId)"
      />
      <template v-else-if="cmpType === 'img'">
        <img
          class="img-file-preview"
          :src="fixFileSrcToThumbnail(file, rootItem)" :alt="file.title"
        />
        <div class="img-actions flex align-center gap10">
          <button class="btn download-btn" @click="downloadImg(fixFileSrcToThumbnail(file, rootItem), file.title)"><span>{{$t('download')}}</span></button>
        </div>
      </template>
      <a
        v-else-if="cmpType === 'link'"
        class="link-file-preview"
        target="_blank" 
        :href="extractFileSrc(file)"
      >{{file.title}}</a>
      
      <router-link
        v-else-if="cmpType === 'file'"
        class="link-file-preview"
        target="_blank" 
        :to="{name: 'FileViewer', query: {file: fixFileSrcToThumbnail(file, rootItem) } }"
      >{{file.title}}</router-link>

    </div>
  </div>
</template>

<script>
import { fixFileSrcToThumbnail, fixVideoSrcToThumbnail } from '../../common/services/file.service';
import { downloadImg } from '../../common/services/util.service';
import VideoTag from './VideoTag.vue';
// import { extractFileSrc } from './file.service'; 
export default {
  name: 'FileList',
  components: {VideoTag},
  props: {
    files: {
      type: Array
    },
    cmpType: {
      type: String,
      default: 'img'
    },
    organizationId: {
      type: String
    },
    rootItem: {
      type: Object
    },
  },
  methods: {
    fixFileSrcToThumbnail,
    fixVideoSrcToThumbnail,
    downloadImg,
    extractFileSrc(fileItem) {
      return fileItem.src || fileItem.link || fileItem.url;
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.files-list {
  width: 100%;
  .img-section {
    h5 {
      width: em(300px);
    }
  }
  .img-file-preview {
    width: em(300px);
    height: em(200px);
    object-fit: cover;
    max-width: 95vw;
    @media (max-width: $small-screen-break) {
    }
  }
  .video-file-preview {
    box-shadow: $light-shadow;
    // height: em(600px);
    height: auto;
    width: 100%;
    max-width: 95vw;
  }
  .link-file-preview {
    // color: blue;
    text-decoration: underline !important;
    cursor: pointer;
  }
  .file-preview {
    position: relative;
    @media (max-width: $small-screen-break) {
      width: 100%;
      .img-file-preview, .video-file-preview {;
        width: 100%;
      }
      .img-file-preview {
        height: em(250px);
      }
    }
  }
  .img-actions {
    position: absolute;
    left: em(10px);
    bottom: em(10px);
    .btn {
      border-radius: 0;
      border: 1px solid var(--clr-0); // black
      // width: em(50px);
      // height: em(25px);
    }
  }

  @media (min-width: $small-screen-break) {
    iframe {
      height: 380px !important;
    }
  }

}
</style>
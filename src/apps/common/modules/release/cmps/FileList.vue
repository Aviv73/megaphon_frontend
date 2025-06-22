<template>
  <div class="files-list-container flex column gap30">
    <div class="files-list flex wrap gap20 width-all width-all">
      <div v-for="(file, idx) in filesToShow" :key="idx" class="flex column gap5 file-preview space-between" :class="{'width-all': ['video', 'iframe'].includes(cmpType), [`${cmpType}-section`]: true}">
        <template v-if="['video', 'img'].includes(cmpType)">
          <h5>
            {{file.title || ''}}
          </h5>
          <div class="flex align-center_ column gap5_ wrap">
            <p v-if="file.info">{{file.info}}</p>
            <p v-if="file.credit">{{$t('credit')}}: {{file.credit}}</p>
            <!-- <template v-if="cmpType === 'img'">
              <span v-if="file.info">|</span>
              <button class="btn clear underline" @click="downloadImg(fixFileSrcToThumbnail(file, rootItem), file.title)">{{$t('download')}}</button>
            </template> -->
          </div>
        </template>
        <p v-if="getFileError(file, rootItem)">{{getFileError(file, rootItem)}}</p>
        <iframe
          v-else-if="cmpType === 'iframe'"
          class="video-file-preview"
          :src="extractFileSrc({src: fixFileSrcToThumbnail(file, rootItem) || file?.src})" controls
        />
        <template v-else-if="cmpType === 'video'">
          <VideoTag
            :format="getFileItemFromRootItem(file, rootItem)?.format"
            class="video-file-preview"
            :src="fixVideoSrcToThumbnail(file, rootItem, organizationId)"
            :fileItem="file"
            :compiledFileItem="getFileItemFromRootItem(file, rootItem)"
          />
          <p v-if="file.description" v-html="file.description"></p>
        </template>
        <FullScreenToggler v-else-if="cmpType === 'img'" class="width-content height-content">
          <img
            class="img-file-preview content"
            :src="fixFileSrcToThumbnail(file, rootItem)" :alt="file.title"
          />
          <div class="img-actions flex align-center gap10">
            <button class="btn download-btn hover-pop" @click="downloadImg(fixFileSrcToThumbnail(file, rootItem), file.title)"><span>{{$t('download')}}</span></button>
          </div>
        </FullScreenToggler>
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
    <PaginationBtns v-if="usePage && (files.length > 1)" v-model="paginationData" :total="files.length" :noLimitSelection="true"/>
  </div>
</template>

<script>
import FullScreenToggler from '../../common/cmps/FullScreenToggler.vue';
import PaginationBtns from '../../common/cmps/ItemSearchList/PaginationBtns.vue';
import { fixFileSrcToThumbnail, fixVideoSrcToThumbnail, getFileError, getFileItemFromRootItem } from '../../common/services/file.service';
import { Utils } from '../../common/services/util.service';
import VideoTag from './VideoTag.vue';
// import { extractFileSrc } from './file.service'; 
export default {
  name: 'FileList',
  components: {VideoTag, PaginationBtns, FullScreenToggler},
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
    fixFileSrcToThumbnail, getFileError, getFileItemFromRootItem,
    fixVideoSrcToThumbnail,
    downloadImg: Utils.downloadImg,
    extractFileSrc(fileItem) {
      let src = fileItem.src || fileItem.link || fileItem.url || '';
      // if (!/^https?:\/\//i.test(this.url)) src = `https://${src}`;
      if (!src.startsWith('https://') && !src.startsWith('http://')) src = `https://${src}`;
      if (this.cmpType === 'iframe') {
        if (Utils.youtubeService.isYoutubeVid(src)) src = Utils.youtubeService.embedUtubeUrl(src);
      }
      return src;
    }
  },
  data() {
    return {
      paginationData: {
        page: 0,
        limit: 1,
      }
    }
  },
  computed: {
    usePage() {
      return false;
      return this.cmpType === 'video';
    },
    filesToShow() {
      if (!this.usePage) return this.files;
      const startIdx = this.paginationData.limit * this.paginationData.page;
      const endIdx = startIdx + this.paginationData.limit;
      return this.files.slice(startIdx, endIdx);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.files-list {
  width: 100%;
  .img-section {
    width: em(300px);
    h5 {
      width: em(300px);
      line-height: normal;
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
    inset-inline-end: em(40px);
    top: em(10px);
    .btn {
      width: em(20px);
      height: em(20px);
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
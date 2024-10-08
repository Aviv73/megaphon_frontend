<template>
  <div class="file-uploader-input flex align-start gap10">
    <img v-if="viewAsImg" class="val-img" :title="valToShow?.name || valToShow?.title" :src="fileToShow" :alt="valToShow?.name || valToShow?.title || $t('clickToUploadFile')" @click="clickInput"/>
    <p class="p-like" v-else-if="!fileToShow && !isLoading" @click="clickInput">{{$t('clickToUploadFile')}}</p>
    <p class="p-like ltr text-end" v-else-if="isLoading" @click="clickInput">{{loadingMsg? loadingMsg : $t('loading') + '...'}}</p>
    <a class="p-like" v-else target="_blanc" :href="fileToShow" :title="valToShow.name || valToShow.title">{{valToShow.name || valToShow.title}}</a>
    <template v-if="!isLoading">
      <input type="file" ref="inputEl" hidden @change="uploadFile" :accept="accept"/>
      <button @click.prevent.stop="clickInput" class="btn big primary_">{{$t('chooseFile')}}</button>
    </template>
    <MiniLoader v-else/>
  </div>
</template>

<script>
import { fixFileSrcToThumbnail, uploadFileToServer, chunkUploadFileToServer } from '../../services/file.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import MiniLoader from '../MiniLoader.vue';
import { cropText } from '../../services/util.service';
export default {
  components: { MiniLoader },
  name: 'FileUploader',
  props: {
    value: [Object, String], // { src, title },
    accept: [String],
    viewAsImg: [Boolean],
    onlySrc: [Boolean],
    uploadFolderName: [String],
    parentData: [Object],
    onupload: [Function],
    rootItem: [Object],
  },
  data() {
    return {
      isLoading: false,
      previewSrc: '',
      loadingMsg: ''
    }
  },
  computed: {
    fileToShow() {
      return this.previewSrc || (this.valToShow? fixFileSrcToThumbnail(this.valToShow, this.rootItem) : '');
    },
    valToShow() {
      return this.onlySrc ? { src: this.value, title: cropText(this.value, 30) } : this.value;
    }
  },
  methods: {
    fixFileSrcToThumbnail,
    clickInput() {
      const { inputEl } = this.$refs;
      inputEl.click();
    },
    getFileFromInput(inputEl) {
      const file = inputEl.files[0];
      return file;
    },
    async doUploadFile(file, uploadFolderName, parentData) {
      this.isLoading = true;
      try {
        let lastDotIdx = file.name.lastIndexOf('.');
        if (lastDotIdx === -1) lastDotIdx = file.name.length;
        const type = file.name.substring(lastDotIdx+1);
        // const type = file.type.split('/').pop();
        const originalName = file.name;
        // const name = file.name.substring(0, lastDotIdx).split(' ').join('-').split('.').join('-');
        // const fileName = `${name}.${type}`;
        const uploadedRes  = await chunkUploadFileToServer(file, uploadFolderName, parentData, ({percents, msg}) => {
          if (msg === 'encrypting') this.loadingMsg = 'Done uploding, encrypting...';
          else this.loadingMsg = `${percents.toFixed(3)}%`;
        });
        if (uploadedRes.previewSrc) this.previewSrc = uploadedRes.previewSrc;
        this.loadingMsg = '';
        const newVal = { name: originalName, title: originalName, type, src: uploadedRes.src, fileId: uploadedRes.fileId };
        return newVal;
      } catch(err) {
        alertService.toast({type: 'danger', msg: `cantUploadFileError`});
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async uploadFile() {
      const file = this.getFileFromInput(this.$refs.inputEl);
      if (!file) return;
      const newVal = await this.doUploadFile(file, this.uploadFolderName, this.parentData);
      if (this.onupload) this.onupload(this.onlySrc? newVal.src : newVal);
      this.$emit('input', this.onlySrc? newVal.src : newVal);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.file-uploader-input {
  .val-img {
    width: em(160px);
    height: em(110px);
    object-fit: contain;
    border: em(1px) solid var(--clr-0);

    background-color: rgb(223, 223, 223);
  }
  button {
    width: em(110px);
  }
  .p-like {
    // width: em(200px);
    width: em(160px);
    overflow: hidden;
    text-overflow: ellipsis;
  }
  @media (max-width: $small-screen-break) {
    // flex-direction: column;
    flex-wrap: wrap;
    gap: em(5px) !important;
  }
}
</style>
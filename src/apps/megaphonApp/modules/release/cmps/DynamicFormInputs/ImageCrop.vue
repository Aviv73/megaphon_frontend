<template>
  <div class="file-uploader-input img-crop-input flex align-center gap10">
    <div class="flex column space-between height-all gap10" v-if="!isLoading">
      <input type="file" ref="inputEl" hidden @change="chooseFile" :accept="accept"/>
      <div v-if="imgToShow" class="text-ph"></div>
      <button @click.prevent.stop="clickInput" class="btn big primary_">{{$t('chooseFile')}}</button>
      <button v-if="imgToShow" @click.prevent.stop="clear" :title="$t('clear')" class="btn clear underline width-content danger_ round_">
        <!-- <div v-html="svgs.x" class="svg-parrent"></div> -->
        {{$t('clear')}}
      </button>
    </div>
    <MiniLoader v-else/>
    <img class="val-img" :title="value?.[0]?.title" :src="imgToShow" :alt="value?.[0]?.title || $t('clickToUploadFile')" @click="clickInput"/>

    <Modal :fullScreen="true" v-if="imgBase64ToCrop" @close="clear">
      <div class="crop-modal flex column gap15">
        <!-- <img :src="imgBase64ToCrop" alt=""> -->

        <div class="cropper-container">
          <!-- <img :src="imgBase64ToCrop" ref="imageRef" alt="Image to crop" /> -->
          <VueCropper
            ref="cropper"
            :aspect-ratioo="16 / 9"
            :src="imgBase64ToCrop"
            preview=".preview"
            :auto-crop-area="1"
          />
        </div>

        <div class="flex width-all align-center space-around">
          <button class="btn big primary" @click="uploadFile">{{$t('send')}}</button>
          <button class="btn big" @click="clearBase64">{{$t('cancel')}}</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import Modal from '@/apps/common/modules/common/cmps/Modal.vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
export default {
  components: { Modal, VueCropper },
  extends: FileUploader,
  name: 'ImageCrop',
  props: {
    value: null, // [{ src, title }],
    onlySrc: null, // [{ src, title }],
    accept: String,
    uploadFolderName: String,
    parentData: Object,
    onupload: Function,
    rootItem: Object
  },
  data() {
    return {
      imgBase64ToCrop: '',
      fileName: ''
    }
  },
  computed: {
    imgToShow() {
      // return fixFileSrcToThumbnail(this.onlySrc? this.value : this.value?.src || ''); // defaultImg
      return this.previewSrc || fixFileSrcToThumbnail(this.value, this.rootItem); // defaultImg
    }
  },
  methods: { 
    async uploadFile() {
      const file = this.base64ToFile(this.getCroppedImg());
      if (!file) return;
      this.imgBase64ToCrop = '';
      const newVal = await this.doUploadFile(file, this.uploadFolderName, this.parentData);
      if (this.onlySrc) {
        this.$emit('input', newVal.src);
        if (this.onupload) this.onupload(newVal.src);
      }
      else {
        this.$emit('input', newVal);
        if (this.onupload) this.onupload(newVal);
      }
      this.imgBase64ToCrop = '';
    },
    async chooseFile() {
      const file = this.getFileFromInput(this.$refs.inputEl);
      if (!file) return;
      this.isLoading = true;
      try {
        this.imgBase64ToCrop = await this.fileToBase64(file);
        this.fileName = file.name;
      } catch (err) {
        alertService.toast({type: 'danger', msg: `cantUploadFileError`});
      }
      this.isLoading = false;
    },
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
      });
    },
    base64ToFile(base64) {
      if (!base64) return null;
      function dataURLtoFile(dataurl, filename = 'file') {
          var arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[arr.length - 1]), 
              n = bstr.length, 
              u8arr = new Uint8Array(n);
          while(n--){
              u8arr[n] = bstr.charCodeAt(n);
          }
          return new File([u8arr], filename, {type:mime});
      }
      return dataURLtoFile(base64, this.fileName);
    },

    clearBase64() {
      this.imgBase64ToCrop = '';
    },

    
    getCroppedImg() {
      const cropper = this.$refs.cropper.cropper;
      const croppedCanvas = cropper.getCroppedCanvas();
      const croppedImage = croppedCanvas.toDataURL();
      return croppedImage;
    },
  }
}
</script>

<style lang="scss">
.megaphon-app {
  .img-crop-input {
    .crop-modal {
      .cropper-container {
        margin: 0 auto;
      }
      .cropper-container, img {
        width: 70vw;
        height: 70vh;
        // height: 30vh;
        object-fit: contain;
      }
      .btn {
        justify-content: center;
      }
    }
  }
}
</style>
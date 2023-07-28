<template>
  <div class="file-uploader-input flex align-start gap30">
    <img v-if="viewAsImg" class="val-img" :title="value?.title" :src="imgToShow" :alt="value?.title || $t('clickToUploadFile')" @click="clickInput"/>
    <p class="p-like" v-else-if="!value?.src && !isLoading" @click="clickInput">{{$t('clickToUploadFile')}}</p>
    <a class="p-like" v-else target="_blanc" :href="value.src" :title="value.title">{{value.title}}</a>
    <template v-if="!isLoading">
      <input type="file" ref="inputEl" hidden @change="uploadFile" :exept="exept"/>
      <button @click.prevent.stop="clickInput" class="btn big">{{$t('chooseFile')}}</button>
    </template>
    <MiniLoader v-else/>
  </div>
</template>

<script>
import { uploadFileToServer } from '../../services/file.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import MiniLoader from '../MiniLoader.vue';
export default {
  components: { MiniLoader },
  name: 'FileUploader',
  props: {
    value: [Object, undefined], // { src, title },
    exept: [String, undefined],
    viewAsImg: [Boolean, undefined],
  },
  computed: {
    imgToShow() {
      return this.value?.src || ''; // defaultImg
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    clickInput() {
      const { inputEl } = this.$refs;
      inputEl.click();
    },
    async uploadFile() {
      const { inputEl } = this.$refs;
      const file = inputEl.files[0];
      if (!file) return;
      this.isLoading = true;
      try {
        const formData = new FormData();
        const lastDotIdx = file.name.lastIndexOf('.');
        const type = file.name.substring(lastDotIdx+1);
        const name = file.name.substring(0, lastDotIdx).split(' ').join('-').split('.').join('-');
        const fileName = `${name}.${type}`;
        formData.append('file' ,file);
        const uploadedRes  = await uploadFileToServer(formData);
        const newVal = { title: fileName, src: uploadedRes.src };
        this.$emit('input', newVal);
      } catch (err) {
        alertService.toast({type: 'danger', msg: `cantUploadFileError'}`});
      }
      this.isLoading = false;
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
    border: em(1px) solid black;

    background-color: rgb(223, 223, 223);
  }
  button {
    width: em(110px);
  }
  .p-like {
    width: em(200px);
  }
}
</style>
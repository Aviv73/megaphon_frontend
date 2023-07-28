<template>
  <div class="img-input flex align-start gap30">
    <img :src="imgToShow" alt="" @click="clickInput"/>
    <input type="file" ref="inputEl" hidden @change="uploadImg"/>
    <button @click="clickInput" class="btn big">{{$t('chooseFile')}}</button>
  </div>
</template>

<script>
import { parseImgFile } from '../services/util.service';
export default {
  name: 'ImgInput',
  props: {
    value: [Object, undefined]
  },
  computed: {
    imgToShow() {
      return this.value?.src || ''; // defaultImg
    }
  },
  methods: {
    clickInput() {
      const { inputEl } = this.$refs;
      inputEl.click();
    },
    async uploadImg() {
      const { inputEl } = this.$refs;
      const file = inputEl.files[0];
      if (!file) return;
      const newVal = await parseImgFile(file);
      this.$emit('input', newVal);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.img-input {
  img {
    width: em(150px);
    height: em(100px);
    object-fit: contain;
    border: em(1px) solid black;
  }
}
</style>
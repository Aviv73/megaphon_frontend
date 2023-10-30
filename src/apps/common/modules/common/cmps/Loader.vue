<template>
  <Modal :styling="!!msg" :class="{fullScreen}">
    <div class="loader flex column gap10 align-center">
      <img class="preview" :src="require('@/assets/images/loader.gif')">
      <p v-if="msg">{{msg}}</p>
    </div>
  </Modal>
</template>

<script>
import Modal from './Modal.vue'
export default {
  name: 'Loader',
  props: {
    msg: {
      type: String,
      default: ''
    },
    fullScreen: {
      type: Boolean,
      default: false
    }
  },
  components: { Modal }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/index';
.loader {
  &:hover {
    pointer-events: none;
  }
  .preview {
    text-align: center;
    width: em(50px);
    height: em(50px);
    &.width-all {
      width: 100%;
      width: 100vw;
      height: auto;
      line-height: 2rem;
      .inner-loader {
        width: em(100px);
        height: em(100px);
      }
    }
  }
}
</style>
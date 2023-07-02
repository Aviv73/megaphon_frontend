<template>
  <Modal class="loader" :class="{fullScreen}" :styling="false">
    <img class="preview" :src="require('@/assets/images/loader.gif')">
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
.loader {
  &:hover {
    pointer-events: none;
  }
  .preview {
    text-align: center;
    width: 50px;
    height: 50px;
    &.width-all {
      width: 100%;
      width: 100vw;
      height: auto;
      line-height: 2rem;
      .inner-loader {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
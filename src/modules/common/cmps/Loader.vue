<template>
  <Modal class="loader" :styling="false">
    <!-- <img class="preview" :src="require('@/assets/images/loader.gif')"> -->
    <div v-if="msg" class="preview width-all flex column align-center">
      <h3 class="width-all text-center">{{msg}}</h3>
      <AnimationLoader class="inner-loader"/>
    </div>
    <AnimationLoader v-else class="preview" />
  </Modal>
</template>

<script>
import AnimationLoader from './AnimationLoader.vue'
import Modal from './Modal.vue'
export default {
  name: 'Loader',
  props: {
    msg: {
      type: String,
      default: ''
    }
  },
  components: { AnimationLoader, Modal }
}
</script>

<style lang="scss" scoped>
.loader {
  &:hover {
    pointer-events: none;
  }
  .preview {
    text-align: center;
    width: 150px;
    height: 150px;
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
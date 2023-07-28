<template>
  <img class="mini-loader" :src="require('@/assets/images/loader.gif')">
</template>

<script>
import Modal from './Modal.vue'
export default {
  name: 'MiniLoader',
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
.mini-loader {
  border: none;
  width: em(40px);
  height: em(40px);
  object-fit: unset;
}
</style>
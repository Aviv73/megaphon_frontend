<template>
  <div class="toggle-modal">
    <div @click="showContent = true" class="modal-toggle-btn">
      <slot name="toggler"/>
    </div>
    <Modal :fullScreen="fullScreen" @close="showContent = false" v-if="showContent">
      <slot name="content"/>
    </Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue'
export default {
  name: 'ToggleModal',
  components: { Modal },
  props: {
    fullScreen: null
  },
  data() {
    return {
      showContent: false
    }
  }
}
</script>

<style>

</style>
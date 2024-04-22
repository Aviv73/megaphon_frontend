<template>
  <div class="toggle-modal">
    <div @click="showContent = true" class="modal-toggle-btn">
      <slot name="toggler"/>
    </div>
    <Modal :showCloseBtn="true" :fullScreen="fullScreen" @close="showContent = false" v-if="showContent">
      <slot v-if="$slots.content" name="content"/>
      <slot v-else />
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
<template>
  <div class="toggle-modal" :class="{disabled}">
    <div @click="open" class="modal-toggle-btn">
      <slot name="toggler"/>
    </div>
    <Modal :showCloseBtn="true" :fullScreen="fullScreen" @close="close" v-if="showContent">
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
    fullScreen: null,
    disabled: Boolean
  },
  data() {
    return {
      showContent: false
    }
  },
  methods: {
    open() {
      if (this.disabled) return;
      this.showContent = true;
    },
    close() {
      this.showContent = false;
    },
  }
}
</script>

<style lang="scss">
.toggle-modal {
  .modal-toggle-btn {
    &:hover { cursor: pointer; }
  }
  &.disabled {
    .modal-toggle-btn {
      &:hover { cursor: not-allowed; }
    }
  }
}
</style>
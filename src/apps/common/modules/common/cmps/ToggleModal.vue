<template>
  <div class="toggle-modal" :class="{disabled}" ref="el">
    <div @click="open" class="modal-toggle-btn" ref="toggler">
      <slot name="toggler"/>
    </div>
    <Modal :showCloseBtn="true" :fullScreen="fullScreen" @close="close" v-show="showContent">
      <slot v-if="$slots.content" name="content"/>
      <slot v-else />
    </Modal>
  </div>
</template>

<script>
import Modal from './Modal.vue';
import { Utils } from '@/apps/common/modules/common/services/util.service';
export default {
  name: 'ToggleModal',
  components: { Modal },
  props: {
    fullScreen: null,
    disabled: Boolean,
    useToggleAnimation: Boolean,
    animationDurationMS: Number
  },
  data() {
    return {
      showContent: false
    }
  },
  methods: {
    async open() {
      if (this.disabled) return;
      this.showContent = true;
      this.$emit('open');
      if (this.useToggleAnimation) {
        await Utils.delay(10);
        this.applyAnimationStyling(true);
      }
    },
    async close() {
      if (this.useToggleAnimation) await this.applyAnimationStyling(false);
      this.showContent = false;
      this.$emit('close');
    },
    async applyAnimationStyling(isOpen, doDelay = true) {
      const ANIMATION_DURATION = (this.animationDurationMS && this.animationDurationMS/1000) || 0.5; // seconds;
      const _getStyle = (_isOpen) => {
        if (_isOpen) return {
          transition: ANIMATION_DURATION + 's',
          top: '50%',
          'inset-inline-end': '50%',
          transform: 'translate(-50%, -50%) scale(1)'
        }
        else {
          const togglerPos = Utils.getElPosInParent(this.$refs.toggler, undefined, true);
          return {
            transition: ANIMATION_DURATION + 's',
            top:  togglerPos.y + (this.$refs.toggler.offsetHeight / 2) + 'px',
            'inset-inline-end': togglerPos.x + (this.$refs.toggler.offsetWidth  / 2) + 'px',
            transform: 'translate(-50%, -50%) scale(0)'
          }
        }
      };
      const styleToAdd = _getStyle(isOpen);
      const modalEl = this.$refs.el.querySelector('.modal');
      if (!modalEl) return;
      for (let key in styleToAdd) {
        modalEl.style[key] = styleToAdd[key];
      }
      if (doDelay) return Utils.delay(ANIMATION_DURATION * 1000);
    }
  },
  mounted() {
    if (this.useToggleAnimation) this.applyAnimationStyling(false);
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
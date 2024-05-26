<template>
  <div class="modal-container" :class="{fullScreen}" @click.stop="">
    <div class="blure" @click.stop="$emit('close')" @touchstart.stop="" @touchend.stop=""></div>
    <div class="modal" :class="{ 'modal-style': styling }">
      <button v-if="showCloseBtn" class="close-btn" @click.stop="$emit('close')">✖</button>
      <slot/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    styling: {
      type: Boolean,
      default: true
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    showCloseBtn: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.modal-container {
  position: absolute;
  z-index: 30;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  .blure {
    position: absolute;
    z-index: 30;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background-color: $blure-clr;
  }
  .modal {
    position: absolute;
    z-index: 30;
    top: 50%;
    left: 50%;
    width: fit-content;
    height: fit-content;
    transform: translate(-50%, -50%);

    overflow: auto;

    @media (max-width: $small-screen-breake) {
      min-width: 90vw;
    }

    .close-btn {
      width: em(15px);
      height: em(15px);
      position: absolute;
      top: em(5px);
      right: em(5px);
      font-size: rem(15px);
    }

    &.modal-style {
      padding: em(20px);
      border-radius: em(5px);
      box-shadow: $light-shadow;
      background-color: #fff;
      color: black;
      input, select {
        color: black;
      }
    }
  }

  &.fullScreen {
    position: fixed;
    width: 100vw;
    height: 100vh;
  }
}
</style>
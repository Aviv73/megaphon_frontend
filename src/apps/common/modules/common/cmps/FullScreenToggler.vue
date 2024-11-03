<template>
  <div class="fullScreenToggler" :class="{fullScreen: fullScreenMode}">
    <slot/>
    <div class="full-screen-btn hover-pop" @click="toggle" :class="{toggled: fullScreenMode}"></div>
  </div>
</template>

<script>
export default {
  name: 'FullScreenToggler',
  data() {
    return {
      fullScreenMode: false
    }
  },
  methods: {
    toggle() {
      this.fullScreenMode = !this.fullScreenMode;
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.fullScreenToggler {
  position: relative;

  .full-screen-btn {
    cursor: pointer;
    position: absolute;
    // background-color: red;
    // z-index: 2;
    left: em(10px);
    top: em(10px);
    width: em(20px);
    height: em(20px);
    background-color: rgba(255, 255, 255, 0.15);
    padding: em(2px);
    border-radius: em(2px);
    // box-shadow: $light-shadow;
    // overflow: hidden;
    background-image: url('~@/assets/images/icons/full-screen.png');
    // background-size: cover;
    background-size: 90%;
    background-repeat: no-repeat;
    background-position: center;
    &.toggled {
      // background-color: green;
      background-image: url('~@/assets/images/icons/exit-full-screen.png');
    }
    // &:after {
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   // transform: scale(1.1);
    // }
    // &.toggled {
    // &:after {
    // }
  }

  &.fullScreen {
    position: fixed !important;
    // background-color: var(--clr-1);
    background-color: black;
    z-index: 100;
    width: 100vw !important;
    height: 100vh !important;
    max-width: unset !important;
    max-height: unset !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    .content {
      width: 100%;
      height: 100%;
      max-width: unset !important;
      max-height: unset !important;
    }
  }
}
</style>
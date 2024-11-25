<template>
  <div class="fullScreenToggler" :class="{fullScreen: fullScreenMode, thin: thinClass && false}">
    <slot/>
    <div class="full-screen-btn hover-pop svg-parrent fullScreenSvg" @click="toggle" :class="{toggled: fullScreenMode}" v-html="fullScreenSvg"></div>
    <div class="full-screen-btn hover-pop svg-parrent exitFullScreenSvg" @click="toggle" :class="{toggled: fullScreenMode}" v-html="exitFullScreenSvg"></div>
  </div>
</template>

<script>
import  { getSvgs } from '@/assets/images/svgs.js';
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
      if (this.fullScreenMode) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    },

    onFullScreenChange() {
      if (document.fullscreenElement) {

      } else {
        this.fullScreenMode = false;
      }
    }
  },
  created() {
    document.addEventListener('fullscreenchange', this.onFullScreenChange);
  },
  destroyed() {
    document.removeEventListener('fullscreenchange', this.onFullScreenChange);
  },
  computed: {
    thinClass() {
      return false;
      const windowSize = { w, h };
      const contentSize = { w, h };
      const contentAspectRatio = contentSize.x / contentSize.h;
      const windowAspectRatio = windowSize.x / windowSize.h;
      if (contentAspectRatio > windowAspectRatio) return true;
    },

    svgs() {
      return getSvgs('white');
    },

    fullScreenSvg() {
      return this.svgs['fullScreen'];
    },
    exitFullScreenSvg() {
      return this.svgs['closeFullScreen'];
    },

    btnSvg() {
      return getSvgs('white')[this.fullScreenMode? 'closeFullScreen' : 'fullScreen'];
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
    // background-size: cover;
    background-size: 90%;
    background-repeat: no-repeat;
    background-position: center;

    // background-image: url('~@/assets/images/icons/full-screen.png');
    // &.toggled {
    //   background-image: url('~@/assets/images/icons/exit-full-screen.png');
    // }
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
  .exitFullScreenSvg {
    display: none;
  }

}
@media (display-mode: fullscreen) {
  * {
    overflow: hidden;
  }
}
.fullScreenToggler {
  &.fullScreen {
    .exitFullScreenSvg {
      display: block !important;
    }
    .fullScreenSvg {
      display: none !important;
    }
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
      height: 100% !important;
      width: 100% !important;
      object-fit: cover !important;
      max-width: unset !important;
      max-height: unset !important;
      margin: auto 0 !important;
    }
    // &.thin {
    //   .content {
    //     height: unset;
    //     width: 100%;
    //     margin: 0 auto;
    //   }
    // }
  }
}
</style>
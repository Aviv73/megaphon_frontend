<template>
  <div class="nav-or-burger" :class="{toTheRight: (side === 'right'), mobileView: !isScreenWide}">
    <button @click="mobileShow = !mobileShow" v-if="showBurger" class="nav-burger height-all flex align-center justify-center">
      <!-- <img :src="require('@/assets/images/icons/nav_burger_white.png')"/> -->
      <span class="actual">☰</span>
    </button>
    <div class="blure" v-if="mobileShow" @click="mobileShow = false"></div>
    <div class="nav-container flex-1" :class="{show: mobileShow}">
      <slot name="header"/>
      <nav class="nav flex align-center space-between wrap gap30">
        <slot/> <!-- <div class="nav-item">About</div> -->
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavOrBurger',
  props: {
    showBurger: {
      type: Boolean,
      default: true
    },
    side: {
      type: String,
      default: 'left'
    }
  },
  data() {
    return {
      mobileShow: false
    }
  },
  computed: {
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    }
  },
  watch: {
    '$route'() {
      this.mobileShow = false;
    },
    '$route.path'() {
      this.mobileShow = false;
    },
    '$route.query'() {
      this.mobileShow = false;
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.nav-or-burger {
  .nav-burger {
    display: none;
  }
  .nav {
    height: 100%;
  }
  // .nav-items {
  //   display: flex;
  //   flex-direction: row;
  //   // align-items: center;
  //   gap: em(10px);
  // }
  // @media (max-width: $small-screen-break) { // $small-screen-break
  &.mobileView {
    // $height: calc(100vh - #{$header-height});
    $height: 100vh;
    .nav-burger {
      display: block;
      .actual {
        width: 25px;
        height: 25px;
      }
      font-weight: bold;
      @include font-size-big;
    }
    .blure {   
      position: fixed;
      top: 0;
      inset-inline-start: 0;
      height: 100vh;
      width: 100vw;
      background-color: $blure-clr;
      z-index: 31;
    }
    .nav-container {
      background-color: var(--clr-1);
      height: $height;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      inset-inline-end: -100%;
      // transform: translateX(-100%);
      transition: 0.3s;
      z-index: 32;
      width: 175px;
      &.show {
        // transform: translateX(0);
        inset-inline-end: 0;
      }
      .nav {
        height: unset;
        flex: 1;
        font-weight: bold;
        display: block;
        overflow-y: auto;
        overflow-x: visible;
        // top: $header-height;
        gap: 0;
        flex-direction: column;
        justify-content: flex-start;
        border-inline-start: 1px solid var(--clr-2);
  
        background-color: var(--clr-3);
  
        .nav-items {
          display: flex;
          flex-direction: column;
          height: fit-content;
          width: 100%;
          gap: 0 !important;
        }
        .nav-item {
          width: 100%;
          height: em(100px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: unset;
          border-radius: unset;
          border-bottom: 1px solid var(--clr-0); // black
          text-align: center;
          color: var(--clr-2);
          background-color: var(--clr-3);
          &.router-link-exact-active {
            // color: #EF4B49;
          }
          &:hover {
            transform: unset !important;
          }
        }
  
      }
    }
    &.toTheRight {
      .nav-container {
        inset-inline-end: unset;
        inset-inline-start: 0;
        &:not(.show) {
          // transform: translateX(100%);
          inset-inline-start: -100%;
        }
      }
    }
  }
}
</style>
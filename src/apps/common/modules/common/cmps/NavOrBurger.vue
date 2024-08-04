<template>
  <div class="nav-or-burger">
    <button @click="mobileShow = !mobileShow" v-if="showBurger" class="nav-burger height-all flex align-center justify-center">
      <!-- <img :src="require('@/assets/images/icons/nav_burger_white.png')"/> -->
      <span class="actual">☰</span>
    </button>
    <div class="blure" v-if="mobileShow" @click="mobileShow = false"></div>
    <nav class="nav flex align-center space-between wrap gap30" :class="{show: mobileShow}">
      <slot/> <!-- <div class="nav-item">About</div> -->
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavOrBurger',
  props: {
    showBurger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mobileShow: false
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
  @media (max-width: $small-screen-breake) { // $small-screen-breake
    $height: calc(100vh - #{$header-height});
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
      right: 0;
      height: 100vh;
      width: 100vw;
      background-color: $blure-clr;
      z-index: 31;
    }
    .nav {
      font-weight: bold;
      display: block;
      position: fixed;
      z-index: 32;
      height: $height;
      top: $header-height;
      overflow-y: auto;
      left: 0;
      transform: translateX(-100%);
      transition: 0.3s;
      gap: 0;
      flex-direction: column;
      justify-content: flex-start;
      &.show {
        transform: translateX(0);
      }
      width: 175px;
      border-inline-start: 1px solid black;

      background-color: $layout-black;

      .nav-items {
        display: flex;
        flex-direction: column;
        height: fit-content;
        width: 100%;
        gap: 0;
      }
      .nav-item {
        width: 100%;
        height: em(100px);
        display: flex;
        align-items: center;
        justify-content: center;
        border: unset;
        border-radius: unset;
        border-bottom: 1px solid black;
        text-align: center;
        &.router-link-exact-active {
          // color: #EF4B49;
        }
        &:hover {
          transform: unset !important;
        }
      }
    }

    
  }
}
</style>
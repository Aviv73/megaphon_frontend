<template>
  <header class="app-header flex align-center">
    <div class="container header-content width-all flex align-center space-between">
      <router-link :to="{name: 'HomePage'}">
        <div class="logo-title">
          <!-- <div class="actual flex column align-center gap10">
            <h1>אגם</h1>
            <p class="sub">הוצאה לאור</p>
          </div> -->
          <img class="actual" :src="require('@/apps/clientApps/agam/assets/images/logo.svg')" alt="אגם הוצאה לאור">
        </div>
      </router-link>

      <!-- <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button> -->
      <button @click="mobileShow = !mobileShow" class="btn nav-burger"><img :src="require('@/apps/clientApps/agam/assets/images/mine/navBurger.png')"/></button>
      <div class="blure" v-if="mobileShow" @click="mobileShow = false"></div>
      <nav class="flex align-center wrap gap40" :class="{show: mobileShow}">
        <router-link :to="mainTo">{{$t('main')}}</router-link>
        <!-- <router-link :to="{name: 'ReleasePage' }">{{$t('updates')}}</router-link> -->
        <router-link :to="{name: 'AboutPage'}">{{$t('about')}}</router-link>
        <!-- <router-link :to="{name: 'ArchivePage' }">{{$t('archive')}}</router-link> -->
      </nav>
      <div class="flex align-center gap20">
        <ul class="media-list flex gap10 wrap">
          <li class="media-preview" v-for="(mediaItem, idx) in mediaItems" :key="idx">
            <a :href="mediaItem.link" target="_blank" class="flex-center gap5 height-all width-all">
              <img :src="mediaItem.img" :alt="mediaItem.name">
            </a>
          </li>
        </ul>
        <div class="release-title" v-if="release">
          <div class="actual flex-center">
            <h2>{{releaseTitle}}</h2>
          </div>
        </div>
      </div>
      </div>
  </header>
</template>

<script>
import Avatar from './Avatar.vue';
import { contactData } from '../services/static.data.js'
export default {
  name: 'AppHeader',
  data() {
    return {
      mobileShow: false,
      mediaItems: [contactData.mediaItems[3], contactData.mediaItems[2], contactData.mediaItems[1], contactData.mediaItems[0]],
    }
  },
  computed: {
    // initReleaseId() {
    //   return this.$store.getters['release/initReleaseId'];
    // },

    mainTo() {
      return this.$store.getters.mainLinkRouteTo;
      // return this.initReleaseId
      //   ? {name: 'ReleaseDetails', params: {id: this.initReleaseId} }
      //   : { name: 'ReleasePage' }
    },

    release() {
      return this.$store.getters['release/selectedItem'];
    },
    releaseTitle() {
      if (!this.release.releaseData.publishedAt) return this.release.releaseData.title;
      const at = new Date(this.release.releaseData.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      const pretyMont = this.$t('months.'+month);
      return `${pretyMont} ${year}`;
    }
  },
  watch: {
    '$route.path'() {
      this.mobileShow = false;
    }
  },
  components: { Avatar },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';

.app-header {
  background-color: $layout-black;
  color: $light-white;
  position: relative;

  .header-content {
    position: relative;
  }
  

  .media-list {
    img {
      width: 35px;
      height: 35px
    }
  }

  .logo-title, .release-title { // .logo-title, 
    width: 120px;
    height: $header-height;
    text-align: center;
    h1, h2 {
      color: white;
    }
    .actual {
      // height: 100%;
      // width: 100%;
      width: 120px;
      height: 110%;
      background-color: $layout-red;
      position: absolute;
      top: 0;
    }
    .sub {
      width: 80px
    }
  }
  .logo-title {
    .actual {
      width: 100px;
      background-color: unset;
      height: unset;
      // position: absolute;
      top: 10px;
      right: 0;
      // right: 12px;
      // left: unset;
      // width: 120px;
      // padding-top: 10px;
      // width: 120px;
      // right: 12px;
      // border-bottom-left-radius: 50%;
      // border-bottom-right-radius: 50%;
    }
  }
  .release-title .actual {
    left: 12px
  }


  nav {
    @include flex-center;
    flex-wrap: wrap;
    justify-content: flex-end;
    a {
      &:hover {
        transform: scale(1.1);
        transition: 0.1s;
      }
    }
  }
  .nav-burger {
    display: none;
  }
  @media (max-width: 0px) { // $small-screen-breake
    $height: calc(100vh - #{$header-height});
    // color: ;
    .nav-burger {
      display: block;
      width: 25px;
      height: 25px;
      font-weight: bold;
      @include font-size-big;
      // font-size: 22px;
    }
    .blure {   
      position: fixed;
      top: $header-height;
      right: 0;
      height: $height;
      width: 100vw;
      background-color: $blure-clr;
      z-index: 31;
    }
    nav {
      font-weight: bold;
      display: block;
      position: fixed;
      z-index: 32;
      height: $height;
      top: $header-height;
      overflow-y: auto;
      right: 0;
      transform: translateX(100%);
      transition: 0.3s;
      &.show {
        transform: translateX(0);
      }
      width: 175px;
      border-inline-start: 1px solid black;

      background-color: white;
      >* {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: unset;
        border-radius: unset;
        border-bottom: 1px solid black;
        text-align: center;
        &.router-link-exact-active {
          color: rgb(157, 193, 255);
        }
        &:hover {
          background-color: rgb(190, 190, 250);
          transform: unset;
        }
      }
    }
  }
}
</style>
<template>
  <header class="app-header flex align-center">
    <div class="container header-content width-all flex align-center space-between">
      <router-link :to="bookReleasePageRouteTo">
        <div class="logo-title">
          <!-- <div class="actual flex column align-center gap10">
            <h1>אגם</h1>
            <p class="sub">הוצאה לאור</p>
          </div> -->
          <img class="actual" :src="require('@/apps/clientApps/agam/assets/images/logo.svg')" alt="אגם הוצאה לאור">
        </div>
      </router-link>

      <!-- <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button> -->
      <button @click="mobileShow = !mobileShow" class="nav-burger"><img :src="require('@/assets/images/nav_burger_white.png')"/></button>
      <div class="blure" v-if="mobileShow" @click="mobileShow = false"></div>
      <nav class="flex align-center flex-1 space-between wrap gap30" :class="{show: mobileShow}">
        <div class="space-div"></div>
        <div class="flex align-center wrap gap30">
          <!-- <router-link class="nav-link" :to="mainTo">{{$t('main')}}</router-link> -->
          <!-- <router-link class="nav-link" :to="bookReleasePageRouteTo">{{$t('main')}}</router-link> -->
          <!-- <button @click="toggleMainView" class="nav-link" :to="mainTo">{{showOnlyreleases? releaseTitle : $t('main')}}</button> -->
          <!-- <router-link :to="{name: 'ReleasePage' }">{{$t('updates')}}</router-link> -->
          <router-link class="nav-link" :to="{name: 'AboutPage'}">{{$t('about')}}</router-link>
          <router-link class="nav-link" :to="bookReleasePageRouteTo">{{$t('allBooks')}}</router-link>
          <router-link class="nav-link" :to="{ name: 'ReleasePage', query: { page: 'monthly', 'filter_params_subType': '', 'filter_params_type': ''  } }">{{$t('archive')}}</router-link>
          <!-- <router-link :to="{name: 'ArchivePage' }">{{$t('archive')}}</router-link> -->
        </div>
        <div class="flex align-center gap20">
          <ul class="media-list flex gap10 wrap">
            <li class="media-preview nav-link" v-for="(mediaItem, idx) in mediaItems" :key="idx">
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
      </nav>
      </div>
  </header>
</template>

<script>
import Avatar from '@/apps/common/modules/common/cmps/Avatar.vue';
import { contactData } from '../../../static.data.js'
export default {
  name: 'agam_AppHeader',
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
    bookReleasePageRouteTo() {
      return { name: 'ReleasePage', query: { page: 'book', 'filter_params_subType': '', 'filter_params_type': ''  } };
    },
    showOnlyreleases() {
      return this.$route.query?.releasesView === 'true';
    },

    mainTo() {
      return { name: 'ReleasePage' };
      // return this.$store.getters.mainLinkRouteTo;
      // return this.initReleaseId
      //   ? {name: 'ReleaseDetails', params: {id: this.initReleaseId} }
      //   : { name: 'ReleasePage' }
    },

    release() {
      return this.$store.getters['release/selectedItem'];
    },
    releaseTitle() {
      if (!this.release?.releaseData?.publishedAt) return this.release?.releaseData?.title || '';
      const at = new Date(this.release.releaseData.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      if (isNaN(month) || isNaN(year)) return this.release.releaseData.title;
      const pretyMont = this.$t('months.'+month);
      return `${pretyMont} ${year}`;
    }
  },
  methods: {
    toggleMainView() {
      const newVal = this.$route.query.releasesView ? !(this.$route.query.releasesView === 'true') + '' : 'false';
      this.$router.push({ ...this.mainTo, query: { ...this.$route.query, releasesView: newVal } });
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
.agam-app {
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
        // top: 10px;
        top: 0;
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
      // @include flex-center;
      flex-wrap: wrap;
      // justify-content: flex-end;
      a {
        &:hover {
          transform: scale(1.05);
          transition: 0.1s;
        }
      }
    }
    .nav-burger {
      display: none;
    }
    @media (max-width: $small-screen-breake) { // $small-screen-breake
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
        // top: $header-height;
        top: 0;
        right: 0;
        // height: $height;
        height: 100vh;
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
        left: 0;
        transform: translateX(-100%);
        transition: 0.3s;
        &.show {
          transform: translateX(0);
        }
        width: 175px;
        border-inline-start: 1px solid black;
  
        // background-color: white;
        background-color: $layout-black;
        // >* {
        .nav-link {
          // color: black;
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
            color: #EF4B49;
          }
          &:hover {
            // background-color: rgb(190, 190, 250);
            transform: unset !important;
          }
        }
        // .media-list {
        //   width: 100%;
        //   *> {
        //     width: 100%;
        //   }

        // }
      }
      .release-title {
        display: none;
      }
    }
  }
}
</style>
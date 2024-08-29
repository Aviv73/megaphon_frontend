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

      <NavOrBurger :showBurger="true" class="flex-1">
        <nav class="nav-items flex align-center flex-1 space-between wrap gap30">
          <div class="space-div"></div>
          <div class="nav-items flex align-center wrap gap30">
            <!-- <router-link class="nav-item" :to="mainTo">{{$t('main')}}</router-link> -->
            <!-- <router-link class="nav-item" :to="bookReleasePageRouteTo">{{$t('main')}}</router-link> -->
            <!-- <button @click="toggleMainView" class="nav-item" :to="mainTo">{{showOnlyreleases? releaseTitle : $t('main')}}</button> -->
            <!-- <router-link :to="{name: 'ReleasePage' }">{{$t('updates')}}</router-link> -->
            <router-link class="nav-item" :to="{name: 'AboutPage'}"><p class="hover-pop">{{$t('about')}}</p></router-link>
            <router-link class="nav-item" :to="bookReleasePageRouteTo"><p class="hover-pop">{{$t('allBooks')}}</p></router-link>
            <router-link class="nav-item" :to="{ name: 'ReleasePage', query: { page: 'monthly', 'filter_params_subType': '', 'filter_params_type': ''  } }"><p class="hover-pop">{{$t('archive')}}</p></router-link>
            <!-- <router-link :to="{name: 'ArchivePage' }">{{$t('archive')}}</router-link> -->
          </div>
          <div class="flex nav-items align-center gap20">
            <ul class="nav-items media-list flex gap10 wrap">
              <li class="media-preview nav-item" v-for="(mediaItem, idx) in mediaItems" :key="idx">
                <a :href="mediaItem.link" target="_blank" class="flex-center gap5 height-all width-all">
                  <img :src="mediaItem.img" :alt="mediaItem.name" class="hover-pop">
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
      </NavOrBurger>
    </div>
  </header>
</template>

<script>
import Avatar from '@/apps/common/modules/common/cmps/Avatar.vue';
import { contactData } from '../static.data.js'
import NavOrBurger from '../../../common/modules/common/cmps/NavOrBurger.vue';
export default {
  name: 'agam_AppHeader',
  data() {
    return {
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
  components: { Avatar, NavOrBurger },
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
        width: em(100px);
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
  
  
    @media (max-width: $small-screen-breake) { // $small-screen-breake
      .nav-or-burger.mobileView {
        .nav-item {
          background-color: $layout-black;
          color: white;
        }
        flex: unset;
        nav {
          // >* {
            &.router-link-exact-active {
              color: #EF4B49;
            }
            background-color: var(--clr-1);
        }
      }
      .space-div {
        display: none;
      }
      .nav-items {
        // gap: 0 !important;
      }
      .release-title {
        display: none;
      }
    }
  }
}
</style>
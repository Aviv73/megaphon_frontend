<template>
  <header class="app-header flex align-center">
    <div class="container header-content width-all flex align-center space-between">
      <div>
        <div class="org-logo">
          <!-- <div class="actual flex column align-center gap10">
            <h1>אגם</h1>
            <p class="sub">הוצאה לאור</p>
          </div> -->
          <img class="actual" :src="org.logoUrl" :alt="org.name">
        </div>
      </div>

      <!-- <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button> -->
      <button @click="mobileShow = !mobileShow" class="nav-burger"><img :src="require('@/assets/images/nav_burger_white.png')"/></button>
      <div class="blure" v-if="mobileShow" @click="mobileShow = false"></div>
      <nav class="flex align-center space-between wrap gap30" :class="{show: mobileShow}">
        <!-- <div class="space-div"></div> -->
        <div class="flex align-center wrap gap30">
          <!-- <router-link class="nav-link" :to="mainTo">{{$t('main')}}</router-link> -->
          <!-- <button @click="toggleMainView" class="nav-link" :to="mainTo">{{showOnlyreleases? releaseTitle : $t('main')}}</button> -->
          <!-- <router-link class="nav-link" :to="{name: 'AboutPage'}">{{$t('about')}}</router-link> -->
          
          <router-link 
            v-for="filterItem in allRouteFilters" :key="filterItem.id"
            :to="{ name: 'CostumePage', query: { page: filterItem.name  } }"
            class="nav-link" 
          >
            {{filterItem.name}}
          </router-link>
          <!-- <router-link :to="{name: 'ArchivePage' }">{{$t('archive')}}</router-link> -->
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'default_AppHeader',
  data() {
    return {
      mobileShow: false,
      // mediaItems: [contactData.mediaItems[3], contactData.mediaItems[2], contactData.mediaItems[1], contactData.mediaItems[0]],
    }
  },
  computed: {
    // initReleaseId() {
    //   return this.$store.getters['release/initReleaseId'];
    // },
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

    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    allRouteFilters() {
      return this.org?.routes?.filter(c => c.showInRoles?.includes('client')) || [];
    },

    // release() {
    //   return this.$store.getters['release/selectedItem'];
    // },
    // releaseTitle() {
    //   if (!this.release?.releaseData?.publishedAt) return this.release?.releaseData?.title || '';
    //   const at = new Date(this.release.releaseData.publishedAt);
    //   const month = at.getMonth() + 1;
    //   const year = at.getFullYear();
    //   if (isNaN(month) || isNaN(year)) return this.release.releaseData.title;
    //   const pretyMont = this.$t('months.'+month);
    //   return `${pretyMont} ${year}`;
    // }
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
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';
.default-app {
  .app-header {
    // background-color: $layout-black;
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
  
    .org-logo {
      // width: 60px;
      height: $header-height;
      .actual {
        height: 100%;
      }
    }
  
  
    nav {
      flex-wrap: wrap;
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
      .nav-burger {
        display: block;
        width: 25px;
        height: 25px;
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
  
        background-color: $layout-black;
        .nav-link {
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
}
</style>
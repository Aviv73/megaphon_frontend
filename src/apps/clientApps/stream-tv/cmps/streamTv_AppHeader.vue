<template>
  <header class="app-header flex align-center">
    <div class="container_ header-content width-all flex align-center space-between">
      <NavOrBurger :showBurger="!!allRouteFilters.length">
        <CostumeNavBar/>
      </NavOrBurger>

      <div class="ph"></div>
      
      <div class="release-title" v-show="appInitedRelease">
        <router-link :to="{ name: 'ReleaseDetails', params: { id: appInitedRelease?._id } }">
          <div class="actual flex-center" ref="titleEl">
            <h2>{{releaseTitle}}</h2>
          </div>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import CostumeNavBar from '../../../common/modules/common/cmps/CostumeNavBar.vue';
import NavOrBurger from '../../../common/modules/common/cmps/NavOrBurger.vue';
export default {
  components: { NavOrBurger, CostumeNavBar },
  name: 'streamTv_AppHeader',
  computed: {
    // initReleaseId() {
    //   return this.$store.getters['release/initReleaseId'];
    // },
    showOnlyreleases() {
      return this.$route.query?.releasesView === 'true';
    },

    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    allRouteFilters() {
      return this.org?.routes?.filter(c => c.showInRoles?.includes('client')) || [];
    },

    appInitedRelease() {
      return this.$store.getters['release/appInitedRelease'];
    },

    release() {
      return this.$store.getters['release/selectedItem'];
    },
    releaseTitle() {
      return this.appInitedRelease?.releaseData?.title || '';
    }
  },
  methods: {
    async setTitleClr() {
      if (!this.$refs.titleEl) return;
      this.$refs.titleEl.style.setProperty('--bg-color', this.org?.designPreferences?.colorsPalate?.[3] || 'black');
    }
  },
  watch: {
    org() {
      this.setTitleClr();
    }
  },
  mounted() {
    this.setTitleClr();
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';
.streamTv-app {
  .app-header {
    position: absolute;
    top: 0;
    background-color: rgba(255, 255, 255, 0) !important;
    font-weight: 600;
    width: 100%;
    max-width: 100%;
    // background-color: $layout-black;
    // position: relative;

    // box-shadow: $light-shadow;

    .release-title { 
      font-size: 1.2em;
      width: em(130px);
      height: $header-height;
      text-align: center;
      position: relative;
      h1, h2 {
        color: white;
      }
      .actual {
        display: block;
        --bg-color: black;
        background-color: var(--bg-color);
        width: 100%;
        height: 140%;
        // background-color: $layout-red;
        position: absolute;
        top: 0;
        // left: em(20px);
        left: 0;
        padding: em(10px);
        &::after {
          content: "";
          border-bottom: em(11px) solid transparent;
          border-left: em(130px) solid var(--bg-color);
          height: 0px;
          position: absolute;
          left: 0;
          top: 100%;
        }
        box-shadow: $light-shadow;
      }
      .sub {
        width: 80px
      }
    }
  
    .header-content {
      position: relative;
      padding: em(20px);
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

    .costume-nav-bar {
      a {
        color: white;
      }
    }
  }
}
</style>
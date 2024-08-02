<template>
  <header class="app-header flex align-center">
    <div class="container_ header-content width-all flex align-center space-between" v-show="lastSeenGroupRelease">
      <NavOrBurger :showBurger="!!allRouteFilters.length">
        <!-- <CostumeNavBar/> -->
        <router-link class="nav-item hover-pop" :to="{ name: 'ReleaseDetails', params: {id: lastSeenGroupRelease?._id, tabName: 'main'} }">{{$t('main')}}</router-link>
        <router-link class="nav-item hover-pop" :to="{ name: 'ReleaseDetails', params: {id: lastSeenGroupRelease?._id, tabName: 'summary'} }">{{$t('summary')}}</router-link>
        <router-link class="nav-item hover-pop" :to="{ name: 'ReleaseDetails', params: {id: lastSeenGroupRelease?._id, tabName: 'broadcastTimes'} }">{{$t('broadcastTimes')}}</router-link>
      </NavOrBurger>

      <div class="ph"></div>
      
      <div class="release-title">
        <router-link :to="{ name: 'ReleaseDetails', params: { id: lastSeenGroupRelease?._id } }">
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

    lastSeenGroupRelease() {
      return this.$store.getters['release/lastSeenGroupRelease'];
    },

    release() {
      return this.$store.getters['release/selectedItem'];
    },
    releaseTitle() {
      return this.lastSeenGroupRelease?.releaseData?.title || '';
    }
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
    width: 100%;
    max-width: 100%;
    background-color: rgba(255, 255, 255, 0) !important;
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
        background-color: var(--header-bgc);
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
          border-left: em(130px) solid var(--header-bgc);
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
      // padding: 20% em(10px) em(20px) em(10px);
      background: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)) !important;
      font-weight: 600;
    }
    

    .costume-nav-bar {
      a {
        color: white;
      }
    }
  }
}
</style>
<template>
  <header class="app-header flex align-center">
    <div class="container_ header-content height-all width-all flex align-center space-between" v-show="lastSeenGroupRelease">
      <NavOrBurger :showBurger="!!allRouteFilters.length">
        <router-link
          v-for="(tabName, idx) in ['main', 'monthlySummary', 'broadcastTimes' ]" :key="tabName"
          class="nav-item tab-name-nav-item"
          :to="{ name: 'ReleaseDetails', params: {id: lastSeenGroupRelease?._id, tabName } }"
          :class="{ selected: ($route.params.tabName === tabName) || (!idx && !$route.params.tabName) }"
        >
          <span class="hover-pop">
            {{$t('release.'+tabName)}}
          </span>
        </router-link>
        <CostumeNavBar class="small-screen-item"/>
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
    color: var(--clr-0);
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
        background-color: var(--clr-4);
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
          border-left: em(130px) solid var(--clr-4);
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
      color: var(--clr-0);
      position: relative;
      padding: 0 em(20px);
      // padding: 20% em(10px) em(20px) em(10px);
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)) !important;
      // font-weight: 600;

      
      .tab-name-nav-item {
        // display: inline-block;
        &.selected {
          border-top: em(5px) solid var(--clr-4);
          padding-bottom: em(5px);
          font-weight: bold;
        }
      }
      @media (min-width: $small-screen-breake) {
        .nav-or-burger, .nav {
          height: 100%;
        }
        .tab-name-nav-item {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }

    

    a, .router-link {
      // color: var(--clr-0);
      color: white;
    }
    // .costume-nav-bar {
    // }
  }
}
</style>
<template>
  <header class="app-header flex align-center">
    <div class="container_ header-content height-all width-all flex align-center space-between" v-if="lastSeenGroupRelease || !isScreenWide || (loggedUser && ($route.name === 'ReleaseDetails'))">
      <NavOrBurger :showBurger="!!allRouteFilters.length" side="right">
        <template v-slot:header v-if="org?.requireAuth">
          <!-- <LoggedUserPreview class="small-screen-item to-the-right_" :viewAsModal="false"/> -->
          <LoggedUserPreview :class="{'height-all': isScreenWide}" v-if="!(lastSeenGroupRelease || !isScreenWide) || !isScreenWide" :viewAsModal="false"/>
        </template>
        <template  v-if="lastSeenGroupRelease">
          <router-link
            v-for="(tabName, idx) in ['main', 'monthlySummary', 'archive', hasBroadcasts && 'broadcastTimes' ].filter(Boolean)" :key="tabName"
            class="nav-item tab-name-nav-item"
            :to="{ name: 'ReleaseDetails', params: {id: lastSeenGroupRelease?._id, tabName } }"
            :class="{ selected: ($route.params.tabName === tabName) || (!idx && !$route.params.tabName && ($route.name === 'ReleaseDetails')) }"
          >
            <span class="hover-pop">
              {{$t('releaseLocales.'+tabName)}}
            </span>
          </router-link>
          <CostumeNavBar class="wide-screen-item" :filterRoutes="route => route.data?.showInHeader"/>
          <router-link class="nav-item tab-name-nav-item" :to="{name: 'ReleasePage', query: {page: 0} }" :class="{ selected: $route.name === 'ReleasePage' }">
            <span class="hover-pop flex align-center gap10">
              <span>
                {{$t('search')}}
              </span>
              <div v-html="searchImg" class="filter-icon-img svg-parrent"></div>
            </span>
          </router-link>
          <CostumeNavBar class="small-screen-item"/>
        </template>
      </NavOrBurger>

      <div class="ph" v-show="lastSeenGroupRelease"></div>
      
      <div class="release-title" v-show="lastSeenGroupRelease">
        <router-link :to="{ name: 'ReleaseDetails', params: { id: lastSeenGroupRelease?._id } }">
            <h2 class="actual">{{releaseTitle}}</h2>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script>
import LoggedUserPreview from '../../../common/modules/auth/cmps/LoggedUserPreview.vue';
import CostumeNavBar from '../../../common/modules/common/cmps/CostumeNavBar.vue';
import NavOrBurger from '../../../common/modules/common/cmps/NavOrBurger.vue';

import  { getSvgs } from '@/assets/images/svgs.js';
export default {
  components: { NavOrBurger, CostumeNavBar, LoggedUserPreview },
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
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },

    hasBroadcasts() {
      return this.lastSeenGroupRelease?.releaseData.childrenReleases.some(c => c.releaseData.broadcastTimes?.length);
    },
    searchImg() {
      return getSvgs('var(--clr-0)').search;
    },

    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';
.streamTv-app {
  .app-header {
    .logged-user-preview {
      padding: em(3px);
      margin-bottom: em(5px);
      .edit-btn, .sep-span {
        display: none;
      }
      // font-size: em(10px);
      .avatar {
        width: em(25px);
        height: em(25px);
      }
      .wellcome-msg {
        font-size: em(15px);
      }
    }
    position: absolute;
    top: 0;
    width: 100%;
    height: var(--header-height);
    min-height: unset;
    max-width: 100%;
    background-color: rgba(255, 255, 255, 0) !important;
    // background-color: $layout-black;
    color: var(--clr-0);
    // position: relative;

    // box-shadow: $light-shadow;

    .release-title { 
      // font-size: 1.2em;
      font-size: em(18px);
      // height: $header-height;
      text-align: center;
      position: absolute;
      top: 0;
      left: em(20px);
      // left: 0;
      .actual {
        width: em(100px);
        min-height: em(80px);
        font-size: 1em;
        color: var(--clr-2);
        display: block;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // word-break: break-all;
        background-color: var(--clr-4);
        // width: 100%;
        // height: 140%;
        position: relative;
        padding: em(10px);
        &::after {
          content: "";
          border-bottom: em(8px) solid transparent;
          border-left: em(100px) solid var(--clr-4);
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
      // color: var(--clr-0);
      color: white;
      position: relative;
      padding: 0 em(20px);
      // padding: 20% em(10px) em(20px) em(10px);
      // background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0)) !important;
      background-color: rgba(0, 0, 0, 0.7) !important;
      // font-weight: 600;
      position: relative;
      
      .tab-name-nav-item {
        // display: inline-block;
        &.selected {
          border-top: em(5px) solid var(--clr-4);
          padding-bottom: em(5px);
          font-weight: bold;
        }
      }
      // @media (min-width: $small-screen-break) {
      .nav-or-burger {
        &:not(.mobileView) {
          height: 100%;
          .nav-container {
            height: 100%;
          }
          .nav-or-burger, .nav {
            height: 100%;
          }
          .tab-name-nav-item {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .nav-item {
            font-size: em(13px);
          }
        }
        &.mobileView {
          // a, .router-link {
          //   color: black;
          // }
          .nav-burger {
            color: white;
          }
          .nav-item {
            background-color: ar(--clr-1);
            color: var(clr-4);
          }
        }
      }
    }

    

    a, .router-link {
      // color: var(--clr-0);
      color: white;
    }

    .filter-icon-img {
      width: em(18px);
      height: em(18px);
    }
    // .costume-nav-bar {
    // }
  }
}
</style>
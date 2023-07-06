<template>
  <header class="app-header flex align-center">
    <div class="container header-content width-all flex align-center space-between height-all">
      <router-link :to="{name: 'ReleasePage', params: {organizationId: organization?._id} }" class="height=all">
        <div class="logo-title height-all flex align-center">
          <img class="actual" :src="logoImgSrc" alt="">
        </div>
      </router-link>

      <div v-if="($route.name === 'ReleasePage') && organization" class="release-filter flex align-center height-all">
        <button :class="{selected: selecterOrgFilterId === filter._id}" v-for="filter in organization.filters" :key="filter._id" @click="emitFilter(filter)">
          {{filter.title}}
        </button>
      </div>

      <!-- <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button> -->
      <!-- <button @click="mobileShow = !mobileShow" class="btn nav-burger"><img :src="require('@/apps/clientApps/agam/assets/images/mine/navBurger.png')"/></button> -->

      <div class="flex align-center gap20 height-all">
        <div class="release-title height-all">
          <div class="actual height-all flex-center">
            <h2>Megaphon</h2>
          </div>
        </div>
      </div>
      </div>
  </header>
</template>

<script>
import Avatar from '@/apps/common/modules/common/cmps/Avatar.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
export default {
  name: 'AppHeader',
  data() {
    return {
      mobileShow: false,
      selecterOrgFilterId: null
    }
  },
  computed: {
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    logoImgSrc() {
      return this.organization?.logoUrl || '';
    },

    mainTo() {
      return this.$store.getters.mainLinkRouteTo;
      // return this.initReleaseId
      //   ? {name: 'ReleaseDetails', params: {id: this.initReleaseId} }
      //   : { name: 'ReleasePage' }
    },
  },
  methods: {
    emitFilter(filter = null) {
      evManager.emit('org-release-filter', filter);
      this.selecterOrgFilterId = filter?._id || null;
    }
  },
  watch: {
    '$route.path'() {
      this.mobileShow = false;
    },
    organization(val) {
      if (!val) return;
      const firstFilter = val.filters?.[0];
      // if (!firstFilter) return;
      // this.selecterOrgFilterId = firstFilter?._id || null;
      this.emitFilter(firstFilter);
    }
  },
  components: { Avatar },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';

.megaphon-app {
  .app-header {
    background-color: #F2F2F2;
    color: black;
    // position: relative;
  
    .header-content {
      position: relative;
    }
    
  
    .logo-title { // .logo-title, 
      height: 50px;
      .actual {
        height: 100%;
      }
    }
    
    .release-filter {
      >* {
        height: 100%;
        padding: 10px;
        &:hover {
          background-color: rgba(32, 144, 212, 0.04);
        }
        &.selected {
          border-top: 3px solid #2090D4;
          font-weight: bold
        }
      }
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
}

</style>
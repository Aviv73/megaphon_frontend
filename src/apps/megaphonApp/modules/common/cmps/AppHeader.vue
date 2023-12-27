<template>
  <header class="app-header flex align-center ignore-theme-style">
    <div class="container header-content width-all flex align-center space-between height-all">
      <router-link :to="{name: 'ReleasePage', params: {organizationId: orgId || organization?._id} }" class="height=all">
        <div class="logo-title height-all flex align-center">
          <img class="actual" :src="logoImgSrc" alt="">
        </div>
      </router-link>

      <div class="release-actions flex align-center gap50 height-all" v-if="($route.name === 'ReleasePage') && organization">
        <div class="links flex align-center gap10 height-all">
          <router-link :to="{ name: 'ReleaseEdit', params: {organizationId: orgId}, query: {page: type.id} }" v-for="type in organization.releaseTypes" :key="type.id">
            <button class="btn big primary">
              {{$t('create')}} {{type.name}}
            </button>
          </router-link>
        </div>
        <div class="filters flex align-center height-all">
          <!-- <button :class="{selected: selecterOrgFilterId === filter.id}" v-for="filter in organization.routes" :key="filter._id" @click="emitFilter(filter)">
            {{filter.title}}
          </button> -->
          
          <router-link
            v-for="filterItem in organization.routes.filter(c => !c.htmlContentFilePath)" :key="filterItem.id"
            :to="{ name: 'ReleasePage', query: { page: filterItem.title  } }"
            class="nav-link flex align-center"
            :class="{selected: $route.query.page === filterItem.title}"
          >
            {{filterItem.title}}
          </router-link>
        </div>
      </div>


      <!-- <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button> -->
      <!-- <button @click="mobileShow = !mobileShow" class="btn nav-burger"><img :src="require('@/apps/clientApps/agam/assets/images/mine/navBurger.png')"/></button> -->

      <div class="flex align-center gap20 height-all">
        <div class="release-title height-all">
          <div class="actual height-all flex-center">
            <!-- <h2>Megaphon</h2> -->
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
    orgId() {
      return this.$route.params.organizationId;
    },
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    logoImgSrc() {
      const megaphonLogog = require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png');
      return this.orgId == '-1'? megaphonLogog : this.organization?.logoUrl || megaphonLogog;
    },
  },
  methods: {
    emitFilter(filter = null) {
      evManager.emit('org-release-filter', filter);
      this.selecterOrgFilterId = filter?.id || null;
    }
  },
  watch: {
    '$route.path'() {
      this.mobileShow = false;
    },
    organization: {
      deep: true,
      handler(val) {
        if (!val) return;
        const firstFilter = val.routes?.[0];
        // if (!firstFilter) return;
        // this.selecterOrgFilterId = firstFilter?._id || null;
        this.emitFilter(firstFilter);
      }
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
    padding: 0 em(10px);
    background-color: #F2F2F2;
    color: black;
    // position: relative;
  
    .header-content {
      position: relative;
    }
    
  
    .logo-title { // .logo-title, 
      height: em(50px);
      .actual {
        height: 100%;
      }
    }
    
    .release-actions {
      .filters {
        >* {
          height: 100%;
          padding: em(10px);
          &:hover {
            background-color: rgba(32, 144, 212, 0.04);
          }
          &.selected {
            border-top: em(3px) solid #2090D4;
            font-weight: bold
          }
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
    @media (max-width: 0) { // $small-screen-breake
      $height: calc(100vh - #{$header-height});
      // color: ;
      .nav-burger {
        display: block;
        width: em(25px);
        height: em(25px);
        font-weight: bold;
        @include font-size-big;
        // font-size: em(22px);
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
        width: em(175px);
        border-inline-start: em(1px) solid black;
  
        background-color: white;
        >* {
          width: 100%;
          height: em(100px);
          display: flex;
          align-items: center;
          justify-content: center;
          border: unset;
          border-radius: unset;
          border-bottom: em(1px) solid black;
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
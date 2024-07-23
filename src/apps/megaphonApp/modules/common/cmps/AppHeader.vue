<template>
  <header class="app-header flex align-center ignore-theme-style">
    <div class="container header-content width-all flex align-center space-between height-all">
      <router-link v-if="!isUserWatchOnly" :to="{name: 'ReleasePage', params: {organizationId: orgId || organization?._id} }" class="height=all">
        <div class="logo-title height-all flex align-center">
          <img class="actual" :src="logoImgSrc" alt="">
        </div>
      </router-link>
      <FormInput class="org-selector" v-model="selectedOrgId" :reactive="true" @change="setOrg" type="select" :items="organizationsToSelect" v-else/>

      <div class="release-actions nav flex align-center gap50 height-all" :class="{show:mobileShow}" v-if="showNavContent">
        <div class="links flex align-center gap10 height-all" v-if="isOrgProducer">
          <router-link :to="{ name: 'ReleaseEdit', params: {organizationId: orgId}, query: {releaseType: type.id} }" v-for="type in organization.releaseTypes" :key="type.id">
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
            v-for="filterItem in filteredRoutesByRoles" :key="filterItem.id"
            :to="{ name: 'ReleasePage', query: { page: filterItem.name  } }"
            class="nav-link flex align-center"
            :class="{selected: $route.query.page === filterItem.name}"
          >
            {{filterItem.name}}
          </router-link>
        </div>
      </div>


      <template v-if="showNavContent">
        <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button>
        <div class="blure" v-if="mobileShow" @click="mobileShow = false"></div>
        <!-- <button @click="mobileShow = !mobileShow" class="btn nav-burger"><img :src="require('@/apps/clientApps/agam/assets/images/mine/navBurger.png')"/></button> -->
      </template>

      <div class="flex align-center gap20 height-all ph">
        <LoggedUserPreview v-if="isUserWatchOnly"/>
        <!-- <div class="release-title height-all">
          <div class="actual height-all flex-center">
            <h2>Megaphon</h2>
          </div>
        </div> -->
      </div>
    </div>
  </header>
</template>

<script> 
import Avatar from '@/apps/common/modules/common/cmps/Avatar.vue';
import { organizationService } from '../../organization/services/organization.service';
import LoggedUserPreview from './LoggedUserPreview.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
export default {
  name: 'AppHeader',
  data() {
    return {
      mobileShow: false,
      // selecterOrgFilterId: null,
      selectedOrgId: this.$route.params.organizationId || ''
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
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    filteredRoutesByRoles() {
      const OrgInUser = this.loggedUser?.organizations.find(c => c._id === this.organization?._id);
      if (!OrgInUser) return [];
      return this.organization?.routes
        .filter(c => !c.htmlContentFilePath)
        .filter(c => !((c.showInRoles.length === 1) && c.showInRoles[0] === 'client'))
        .filter(c => c.showInRoles.find(role => OrgInUser.roles?.includes(role))) || [];
    },
    showNavContent() {
      return (this.$route.name === 'ReleasePage') && this.organization;
    },
    isOrgProducer() {
      return organizationService.isUserRoleInOrg(this.organization?._id, 'producer', this.loggedUser);
    },
    isUserWatchOnly() {
      return this.$store.getters['auth/isWatchOnly'];
    },

    organizationsToSelect() {
      return [
        ...(this.$store.getters['organization/items']?.map(c => ({
          img: c.logoUrl,
          label: c.name + (this.isOrgPending(c._id)? ` (${this.$t('pending')})` : ''),
          value: c._id,
          disabled: this.isOrgPending(c._id)
        })) || []),
        { label: 'new', value: 'new' }
      ];
    }
  },
  methods: {
    // emitDefaultFilter() {
    //   if (!this.organization) return;
    //   const firstFilter = this.organization.routes?.[0];
    //   console.log('WOOWOWO', firstFilter);
    //   // if (!firstFilter) return;
    //   // this.selecterOrgFilterId = firstFilter?._id || null;
    //   this.emitFilter(firstFilter);
    // },
    // emitFilter(filter = null) {
    //   evManager.emit('org-release-filter', filter);
    //   this.selecterOrgFilterId = filter?.id || null;
    // }
    setOrg(orgId) {
      if (orgId === 'new') this.$router.push({name: 'JoinOrgPage'});
      else this.$router.push({ name: 'ReleasePage', params: { organizationId: orgId } });
    },

    isOrgPending(orgId) {
      return organizationService.isOrgPending(orgId, this.loggedUser);
    }
  },
  watch: {
    '$route.path'() {
      this.mobileShow = false;
      // this.emitDefaultFilter();
    },
    '$route.query'() {
      this.mobileShow = false;
      // this.emitDefaultFilter();
    },
    // 'organization._id'(val) {
    //   this.selectedOrgId = val;
    // },
    '$route.params.organizationId'(val) {
      if (val) this.selectedOrgId = val;
    }
    // organization: {
    //   deep: true,
    //   handler(val) {
    //     this.emitDefaultFilter(val);
    //   }
    // }
  },
  components: { Avatar, LoggedUserPreview, FormInput }
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
      width: 100%;
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
    .blure {
      display: none;
    }
    @media (max-width: $small-screen-breake) { // $small-screen-breake
      .ph {
        display: none;
      }

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
        display: block;
        position: fixed;
        top: $header-height;
        right: 0;
        height: $height;
        width: 100vw;
        background-color: $blure-clr;
        z-index: 31;
      }
      .release-actions {
        .filters {
          >* {
            height: unset;
          }
        }
      }
      .nav {
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
        width: em(175px);
        border-inline-start: em(1px) solid black;
  
        background-color: white;
        >* {
          flex-direction: column;
          height: fit-content;
          >* {
            width: 100%;
            height: em(100px) !important;
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


    .org-selector {
      padding: 0;
      * {
        background: unset;
        padding: 0;
        width: fit-content;
        border: unset;

      }
      .input {
        // min-width: unset;
        .head {
          flex-direction: row-reverse;
        }
        .selected-preview {
          flex-direction: row-reverse;
          img {
            height: $header-height;
            width: $header-height;
            background: unset;
          }
        }
        .drop-down-item {
          width: 100%;
        }
      }
    }
  }
}

</style>
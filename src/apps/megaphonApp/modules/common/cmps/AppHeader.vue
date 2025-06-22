<template>
  <header class="app-header flex align-center ignore-theme-style_">
    <div class="container header-content width-all flex align-center space-between height-all" :class="{[$route.matched.find(c => c.name === 'MainSidebarView') || true ? 'full-screen-container' : 'container'] : true}">
      <router-link v-if="!isUserWatchOnly || !selectedOrgId || isSingleOrgMode" :to="{name: 'ReleasePage', params: {organizationId: orgId || organization?._id} }" class="height-all">
        <div class="logo-title height-all flex_ align-center">
          <img v-if="showLogo" class="actual" :src="logoImgSrc" alt=""/>
        </div>
      </router-link>
      <FormInput v-else class="org-selector" v-model="selectedOrgId" :reactive="true" @change="setOrg" type="select" :items="organizationsToSelect"/>
      
      <template v-if="headerMode === 'default'">
        <NavOrBurger class="release-actions align-center_ space-between flex gap10 height-all" v-if="showNavContent" :class="{'flex-1': isScreenWide}">
          <LoggedUserPreview v-if="isUserWatchOnly" class="to-the-right nav-item small-screen-item"/>
          <div class="links create-links nav-items flex align-center gap15 height-all" v-if="isOrgProducer">
            <router-link class="nav-item create-nav gap15" :to="{ name: 'ReleaseEdit', params: {organizationId: orgId}, query: {releaseType: type.id} }" v-for="type in organization.releaseTypes" :key="type.id">
              <button class="btn_ big primary">
                <span class="hover-pop">{{$t('create')}} {{type.name}}</span>
              </button>
            </router-link>
          </div>

          <div class="nav-items flex align-center gap30 wrap height-all flex-1 justify-end">
            <form class="flex-1 flex justify-end" @submit.prevent="evManager.emit('searchReleases', searchTerm)" v-if="isScreenWide && ($route.name === 'ReleasePage')">
              <FormInput class="search" placeholder="search" iconPos="left" v-model="searchTerm" @change_="val => evManager.emit('search', val)">
                <button>
                  <div v-html="searchImg" class="filter-icon-img svg-parrent"></div>
                  <!-- <img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/search.svg')"/> -->
                </button>
              </FormInput>
            </form>
            <div class="filters nav-items flex align-center_ height-all">
              <!-- <button :class="{selected: selecterOrgFilterId === filter.id}" v-for="filter in organization.routes" :key="filter._id" @click="emitFilter(filter)">
                {{filter.title}}
              </button> -->
              <router-link
                v-for="filterItem in filteredRoutesByRoles" :key="filterItem.id"
                :to="{ name: 'ReleasePage', query: { page: filterItem.name  } }"
                class="nav-item flex align-center height-all"
                :class="{selected: $route.query.page === filterItem.name}"
              >
                <span class="hover-pop">{{filterItem.name}}</span>
              </router-link>
            </div>
          </div>
          <template v-if="isUserWatchOnly">
            <button class="nav-item logout-btn" @click="logout">{{$t('authLocales.logout')}}</button>
            <router-link class="nav-item edit-btn" :to="{ name: 'AccountEditModal', params: { id: loggedUser._id } }">{{$t('authLocales.editUserDetails')}}</router-link>
            <router-link class="nav-item org-header flex align-center gap10 small-screen-item" :to="{name: 'SettingsPage'}">
              <img :src="require('@/assets/images/icons/settings.png')" class="icon" alt=""/>
            </router-link>
          </template>
          <!-- <div class="release-actions nav flex align-center gap50 height-all" :class="{show:mobileShow}" v-if="showNavContent">
          </div> -->
        </NavOrBurger>

        <div class="flex align-center gap20 height-all wide-screen-item" v-if="isUserWatchOnly">
          <template>
            <router-link class="nav-list-item org-header flex align-center gap10" :to="{name: 'SettingsPage'}">
              <!-- <p>{{$t('settingsLocales.settings')}}</p> -->
              <img :src="require('@/assets/images/icons/settings.png')" class="icon" alt=""/>
            </router-link>
            <LoggedUserPreview class="to-the-right"/>
          </template>
          <!-- <div class="release-title height-all">
            <div class="actual height-all flex-center">
              <h2>Megaphon</h2>
            </div>
          </div> -->
        </div>
        <!-- <div v-else class="ph wide-screen-item"></div> -->
      </template>

      <!-- <template v-if="headerMode === 'ReleaseEdit'">
        <div class="flex gap10 align-center space-between container height-all">
          <div>
            <button class="underline btn_ big" v-if="itemToEdit._id" @click="deleteItem">{{$t('delete')}}</button>
          </div>
          <div class="flex align-center gap30 height-all">
            <button class="btn big" @click="close">{{$t('close')}}</button>
            <button class="btn big ignor-flex flex align-center gap15" :disabled="!itemToEdit._id" @click="showDesign = true" ><div v-html="megSvgs.PreviewActions.eye" class="svg-parrent"></div><span>{{$t('releaseLocales.designAndPreview')}}</span></button>
            <button class="btn big ignor-flex flex align-center gap15" :disabled="!isItemValid" @click="saveItem"><div v-html="megSvgs.save" class="svg-parrent"></div><span>{{$t('save')}}</span></button>
            <button class="btn big bg-4 clr-1 ignor-flex flex align-center gap15" :disabled="!isItemValid" @click="confirmAndDistribute"><div v-html="megSvgs.PreviewActions.distribute" class="svg-parrent"></div><span>{{$t('distributeLocales.distribute')}}</span></button>
          </div>
        </div>
      </template> -->
    </div>
  </header>
</template>

<script> 
import Avatar from '@/apps/common/modules/common/cmps/Avatar.vue';
import { organizationService } from '../../organization/services/organization.service';
import LoggedUserPreview from '../../../../common/modules/auth/cmps/LoggedUserPreview.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
import NavOrBurger from '../../../../common/modules/common/cmps/NavOrBurger.vue';
import appConfig from '@/appConfig';
import { fixFileSrcToThumbnail } from '../../../../common/modules/common/services/file.service';
import  { getSvgs as getGlobalSvgs } from '@/assets/images/svgs.js';
import  { getMegSvgs } from '../../../assets/images/svgs';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
export default {
  name: 'AppHeader',
  data() {
    return {
      // selecterOrgFilterId: null,
      selectedOrgId: this.$route.params.organizationId || '',
      showLogo: true,
      searchTerm: '',

      evManager
    }
  },
  computed: {
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },
    isSingleOrgMode() {
      return appConfig.singleOrgMode;
    },
    orgId() {
      return this.$route.params.organizationId;
    },
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    logoImgSrc() {
      const megaphonLogo = this.$store.getters.envManagement?.logo || require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png');
      return ((this.orgId == '-1')? megaphonLogo : fixFileSrcToThumbnail(this.organization?.logo, this.organization)) || megaphonLogo;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    filteredRoutesByRoles() {
      const OrgInUser = this.loggedUser?.organizations.find(c => c._id === this.organization?._id);
      if (!OrgInUser) return [];
      return this.organization?.routes
        ?.filter(c => !c.htmlContentFilePath)
        .filter(c => !((c.showInRoles.length === 1) && c.showInRoles[0] === 'client'))
        .filter(c => c.showInRoles.find(role => OrgInUser.roles?.includes(role))) || [];
    },
    showNavContent() {
      return true || ((this.$route.name === 'ReleasePage') && this.organization);
    },
    isOrgProducer() {
      return organizationService.isUserRoleInOrg(this.organization?._id, 'producer', this.loggedUser);
    },
    isUserWatchOnly() {
      return this.$store.getters['auth/isWatchOnly'];
    },

    organizationsToSelect() {
      return [
        ...(this.getOnlyOrgsToShow(this.$store.getters['organization/items'], appConfig)?.map(c => ({
          img: fixFileSrcToThumbnail(c.logo, c),
          label: c.name + (this.isOrgPending(c._id)? ` (${this.$t('pending')})` : ''),
          value: c._id,
          disabled: this.isOrgPending(c._id)
        })) || [])
        // ,
        // { label: 'new', value: 'new' }
      ];
    },

    searchImg() {
      return getGlobalSvgs('var(--clr-0)').search;
    },


    headerMode() {
      console.log(this.$route.name);
      if (this.$route.name === 'ReleaseEdit') return 'ReleaseEdit';
      if (this.$route.name === 'ReleaseDistribution') return 'ReleaseDistribution';
      return 'default';
    },
    megSvgs() {
      return getSvgs();
    }
  },
  methods: {
    // emitDefaultFilter() {
    //   if (!this.organization) return;
    //   const firstFilter = this.organization.routes?.[0];
    //   // if (!firstFilter) return;
    //   // this.selecterOrgFilterId = firstFilter?._id || null;
    //   this.emitFilter(firstFilter);
    // },
    // emitFilter(filter = null) {
    //   evManager.emit('org-release-filter', filter);
    //   this.selecterOrgFilterId = filter?.id || null;
    // }
    getOnlyOrgsToShow: organizationService.getOnlyOrgsToShow,
    setOrg(orgId) {
      if (orgId === 'new') this.$router.push({name: 'JoinOrgPage'});
      else this.$router.push({ name: 'ReleasePage', params: { organizationId: orgId } });
    },

    isOrgPending(orgId) {
      return organizationService.isOrgPending(orgId, this.loggedUser);
    },

    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'LoginPage' });
    }
  },
  watch: {
    logoImgSrc() { // for some reason sometimes th logo dont change, this watch makes sure the right logo appeares;;
      this.showLogo = false;
      this.$forceUpdate();
      setTimeout(() => {
        this.showLogo = true;
      }, 0);
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
  components: { Avatar, LoggedUserPreview, FormInput, NavOrBurger }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';

.megaphon-app {
  .app-header {
    z-index: 6;
    // padding: 0 em(10px);
    // background-color: #F2F2F2;
    // color: black;
    // position: relative;
  
    .header-content {
      width: 100%;
      position: relative;
      @media (min-width: $small-screen-break) {
        padding-inline-start: 0;
      }
    }

    .search {
      overflow: unset;
      // width: rem(310px);
      // width: rem(280px);
      flex: 1;
      max-width: rem(310px);
      height: 35px;
      // border-bottom: em(1px) solid $light-gray;
      input {
        // border: 0;
        // border: unset;
        border-radius: 0;
      }
      .filter-icon-img {
        width: em(15px);
        height: em(15px);
      }
    }
    
  
    .logo-title { // .logo-title, 
      // height: em(50px);
      height: 100%;
      width: rem(200px);
      margin-inline-end: rem(15px);
      // background-color: #666666;
      .actual {
        height: 100%;
        width: unset;
        max-width: 100%;
        object-fit: contain;
      }
    }

    .create-nav {
      button {
        // background-color: unset !important;
        // box-shadow: unset !important;
        // padding: unset !important;
        // width: unset !important;
        // height: unset !important;
        span {
          display: flex;
          align-items: center;
          gap: em(5px);
          &::before {
            content: '+';
            font-size: em(20px);
            font-weight: 1000;
          }
        }
      }
    }
    
    .release-actions {
      .create-links {
        font-size: em(18px);
      }
      .filters {
        font-size: em(16px);
        >*, .nav-item {
          // height: 100%;
          padding: em(10px);
          &:hover {
            // background-color: rgba(32, 144, 212, 0.04);
            color: var(--clr-0);
            background-color: var(--clr-5) !important;
          }
          &.selected {
            border-top: em(6px) solid var(--clr-4);
            padding-top: em(4px);
            font-weight: bold
          }
        }
      }

      .btn {
        color: var(--clr-0);
        background-color: var(--clr-4);
      }
    }

    .logged-user-preview {
      background-color: unset;
      // color: black;
      --preview-clr: var(--clr-2) !important;
      @media (max-width: $small-screen-break) {
        .actions-section {
          display: none;
        }
      }
    }
    

    @media (max-width: $small-screen-break) { // $small-screen-break
      .nav {
        background-color: white;
      }
      .ph {
        display: none;
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
<template>
  <div class="sidebar-container" :class="{closed: !mobileToggled}">
    <div class="blur" @click="mobileToggled = !mobileToggled"></div>
    <div class="toggle-btn" @click="mobileToggled = !mobileToggled">☰</div>
    <aside class="main-sidebar height-all flex column space-between_ gap5">
      <LoggedUserPreview :organizationId="selectedOrgId"/>
      <div class="flex column space-between side-bar-content flex-1 pretty-scroll">
        <ul class="organization-list flex-1">
          <li :class="{selected: selectedOrgId === org._id, opened: selectedOrgId === org._id}" class="nav-item-preview organization-preview" v-for="org in organizations" :key="org._id">
            <div class="nav-list-item item-header flex align-center gap10" @click="selectOrg(org)">
              <!-- <Avatar :size="25">{{org?.name?.slice(0,2) || ''}}</Avatar> -->
              <p class="flex-1 flex space-between">
                <span :class="{'hover-pop': !isOrgPending(org)}">{{org.name}}</span>
                <span v-if="isOrgPending(org)">({{$t('pending')}})</span>
              </p>
              <div v-if="organizations.length > 1" class="svg-parrent toggle-arrow" :class="{toggled: selectedOrgId === org._id}" v-html="svgs.toggleArrow"></div>
            </div>
            <div class="flex column" v-if="selectedOrgId === org._id && isRoleInOrg('producer')">
              <!-- <router-link class="nav-list-item inner-list-item" :to="{ name: 'ReleasePage', params: { organizationId: org._id } }">
                <DropDiv :onDrop="() => addReleasesToFolder(null, null)">
                  <div class="height-all width-all flex align-center" @click="clearFolderSelecion">
                    {{$t('releaseLocales.releases')}}
                  </div>
                </DropDiv>
              </router-link> -->
              <CostumeNavBar :baseRoute="{ name: 'ReleasePage', params: { organizationId: org._id } }" :routeRoles="['producer', 'admin']" :beforeSvg="svgs.tv"/>
              <!-- <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: org._id } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.envelope" class="svg-parrent"></div>{{$t('accountLocales.mediaAccounts')}}</span></router-link>
              <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: org._id } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.contacts" class="svg-parrent"></div>{{$t('accountLocales.accounts')}}</span></router-link> -->
              <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: org._id } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.contacts" class="svg-parrent"></div>{{$t('contactLocales.contacts')}}</span></router-link>
              <div class="system-nav" v-if="isRoleInOrg('producer')" :class="{opened_: showOrgSystemNav}">
                <div class="nav-list-item flex align-center space-between gap10 clr-6" @click="showOrgSystemNav = !showOrgSystemNav">
                  <p><span class="hover-pop flex align-center gap10"><div v-html="svgs.system" class="svg-parrent"></div>{{$t('sidebar.system')}}</span></p>
                  <div class="svg-parrent toggle-arrow" :class="{toggled: showOrgSystemNav}" v-html="svgs.toggleArrow"></div>
                </div>
                <div class="flex column" v-if="showOrgSystemNav">
                  <router-link v-if="isRoleInOrg('producer') && org.requireAuth" class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: org._id }, query: { roleType: 'watchOnly' } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.envelope" class="svg-parrent"></div>{{$t('accountLocales.mediaAccounts')}}</span></router-link>
                  <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: org._id }, query: { roleType: 'producerAndAdmin' } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.key" class="svg-parrent"></div>{{$t('accountLocales.accounts')}}</span></router-link>
                  <router-link v-if="isRoleInOrg('producer') && org.restrictVideos" class="nav-list-item inner-list-item" :to="{ name: 'StatsPage', params: { organizationId: org._id } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.stats" class="svg-parrent"></div>{{$t('statsLocales.stats')}}</span></router-link>
                  <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'OrganizationEdit', params: { id: org._id } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.organization" class="svg-parrent"></div>{{$t(org.type === 'artist' ? 'artistLocales.artistSettings' : 'organizationLocales.organizationSettings')}}</span></router-link>
                </div>
              </div>
              <FoldersNav v-if="isRoleInOrg('producer') && false" :currentDropableFolderPath="currentDropableFolderPath" :folders="org.folders || []" :parentItem="org"/>
            </div>
          </li>
        </ul>
        <div class="nav-list-preview" v-if="false">
          <router-link v-if="!isSingleOrgMode" class="nav-list-item item-header flex align-center gap10" :to="{name: 'JoinOrgPage'}">
            <!-- <Avatar :size="25">{{''.slice(0,2)}}</Avatar> -->
            <p>{{$t('organizationLocales.addOrganization')}}</p>
          </router-link>
        </div>
        <div class="nav-item-preview system-nav" v-if="isAdmin" :class="{opened: showAdminNav}">
          <div class="nav-list-item item-header flex align-center space-between gap10" @click="showAdminNav = !showAdminNav">
            <!-- <Avatar :size="25">{{'מגפון'.slice(0,2)}}</Avatar> -->
            <p><span class="hover-pop flex align-center gap10"><div v-html="svgs.management" class="svg-parrent"></div>{{$t('sidebar.megaphonGeneral')}}</span></p>
            <div class="svg-parrent toggle-arrow" :class="{toggled: showAdminNav}" v-html="svgs.toggleArrow"></div>
          </div>
          <div class="flex column" v-if="showAdminNav">
            <router-link class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: '-1' } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.contacts" class="svg-parrent"></div>{{$t('contactLocales.contacts')}}</span></router-link>
            <router-link class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: '-1' } }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.accounts" class="svg-parrent"></div>{{$t('accountLocales.accounts')}}</span></router-link>
            <router-link class="nav-list-item inner-list-item" :to="{ name: 'OrganizationPage' }"><span class="hover-pop flex align-center gap10"><div v-html="svgs.organizations" class="svg-parrent"></div>{{$t('organizationLocales.organizations')}}</span></router-link>
          </div>
        </div>
        
        <div class="nav-list-preview">
          <router-link class="nav-list-item item-header flex align-center gap10" :to="{name: 'SettingsPage'}">
            <p>
              <span class="hover-pop flex align-center gap10">
                <div v-html="svgs.settings" class="svg-parrent"></div>
                {{$t('settingsLocales.settings')}}
              </span>
            </p>
          </router-link>
        </div>
      </div>
      <div class="side-bar-footer" v-if="false">
        <div class="powered-by flex align-end space-between gap10">
          <!-- Powered by Megaphon -->
          <p>Powered by</p> <img :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
        </div>
      </div>
      <!-- <div class="flex column space-between gap10 flex-1">
      </div> -->
    </aside>
  </div>
</template>



<script>
import Avatar from '../../../../../common/modules/common/cmps/Avatar.vue';
import FoldersNav from './FoldersNav.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import DropDiv from '../dnd/DropDiv.vue';
import { organizationService } from '../../../organization/services/organization.service';
import LoggedUserPreview from '../../../../../common/modules/auth/cmps/LoggedUserPreview.vue';
import appConfig from '@/appConfig';
import CostumeNavBar from '../../../../../common/modules/common/cmps/CostumeNavBar.vue';
import  { getSvgs } from '../../../../assets/images/svgs.js';
export default {
  components: { Avatar, FoldersNav, DropDiv, LoggedUserPreview, CostumeNavBar },
  name: 'SideBar',
  data() {
    return {
      showAdminNav: false,
      showFolders: false,
      showActionsModal: false,
      mobileToggled: false,
      showOrgSystemNav: false
    }
  },
  props: {
    organizations: [Array],
    loggedUser: [Object],
    currentDropableFolderPath: {
      type: String,
    }
    // selectedOrgId: {
    //   type: String,
    //   required: false,
    //   default: ''
    // }
    
  },
  computed: {
    selectedOrgId() {
      return this.$route.params.organizationId;
    },
    isAdmin() {
      return this.$store.getters['auth/isAdmin'];
    },
    
    isSingleOrgMode() {
      return appConfig.singleOrgMode;
    },

    svgs() {
      return getSvgs().navActions; 
    }
  },
  methods: {
    isRoleInOrg(role) {
      return organizationService.isUserRoleInOrg(this.selectedOrgId, role, this.loggedUser);
    },
    isOrgPending(org) {
      // return organizationService.getOrgItemInAccount(this.loggedUser, org._id)?.status === 'pending';
      return organizationService.isOrgPending(org._id, this.loggedUser);
    },
    selectOrg(org) {
      if (this.isOrgPending(org)) return;
      if (org.redirectUrl) return window.open(org.redirectUrl, '_blank');
      const orgId = org._id;
      this.$router.push({ name: 'ReleasePage', params: { organizationId: orgId } });
      this.showFolders = false;
      // this.$emit('selectOrganization', orgId);
    },

    clearFolderSelecion() {
      evManager.emit('folder-selected', null, null);
    },

    addReleasesToFolder(folder, foldPath) {
      evManager.emit('folder-updated', this.selectedOrgId, foldPath, folder);
    }
  },
  watch: {
    selectedOrgId() {
      this.showOrgSystemNav = false;
      this.clearFolderSelecion();
    },
    '$route.query'() {
      this.mobileToggled = false;
      // this.emitDefaultFilter();
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme.megaphon-app { // MOVED TO
//   .sidebar-container {
//     color: #cecece;
//     .main-sidebar {
//       // .nav-item-preview {
//       //   .nav-list-item {
//       //     &:hover {
//       //       background-color: lighten($color: #2090D4, $amount: 20%) !important;
//       //     }
//       //   }

//       //   &.selected {
//       //     .item-header {
//       //       background-color: var(--clr-4);
//       //       // color: var(--clr-4)
//       //       color: white
//       //     }
//       //     .router-link-active {
//       //       background-color: rgba(147, 214, 254, 0.3);
//       //       color: var(--clr-4);
//       //     }
//       //   }
//       // }
//       .nav-list-item {
//         border-bottom: em(0.5px) solid #003d5e;
//       }

//       // @media (max-width: $small-screen-break) {
//       //   // .main-sidebar {
//       //     background-color: var(--clr-2);
//       //   // }
//       // }
//     }
//     // .toggle-btn {
//     //   color: var(--clr-0);
//     // }
//   }
// }
.megaphon-app {
  .sidebar-container {
    position: relative;
    z-index: 5;
    font-size: rem(16px);
    .main-sidebar {
      height: calc(100vh - #{$header-height}); //  - 22px
      max-height: calc(100vh - #{$header-height}); //  - 22px
      .side-bar-content {
        max-height: calc(100% - #{em(40px)});
        height: calc(100% - #{em(40px)});
        overflow-y: auto;
        overflow-x: unset;
        flex: 1;
        // height: 0px;
        // flex-grow: 1;
        // overflow-y: auto;
      }
      color: var(--clr-4);
      position: sticky;
      top: calc(#{$header-height} + 0px);
      
      // padding: em(10px);
      // height: auto;
  
      // width: em(225px);
      // width: em(200px);
      width: rem(200px);
  
      .app-avatar {
       color: var(--clr-1);
       border: 0;
      }
      .folder-avatar {
        background-color: unset;
        .avatar-img {
          height: 40%;
          width: unset;
          border-radius: 50%;
          border-radius: 0;
        }
      }

      .costume-nav-bar {
        gap: 0;
        border-bottom: 1px solid rgba(128, 128, 128, 0.3);
        .nav-item {
          width: 100%;
        }
      }

      .logged-user-preview {
          padding: em(10px);
          // font-size: em(12px);
      }

      .svg-parrent {
        // height: 0.8em;
        width: 1em;
      }

      // .nav-item-msg {}
  
      .nav-list-item, .nav-item {
        // font-size: em(12px);
        &:hover {
          background-color: var(--clr-5) !important;
          color: var(--clr-1);
        }
      }
      .nav-item-preview {
  
        .toggle-arrow {
          transition: 0.3s;
          width: 0.7em;
          transform: rotate(0deg);
          &.toggled {
            transform: rotate(180deg); 
          }
        }
        &.selected {
          .item-header {
            background-color: var(--clr-4);
            color: var(--clr-1);
          }
          .router-link-exact-active {
            // background-color: rgba(147, 214, 254, 0.3);
            background-color: var(--clr-5);
            color: var(--clr-1);
          }
        }
        // &.opened {
        //   .toggle-arrow {
        //     transform: rotate(180deg); 
        //   }
        // }
        
        &:not(.selected):not(.system-nav) {
          background-color: rgba(0, 0, 0, 0.075);
        }
      }

      .organization-preview_ {
        &:only-child {
          .inner-list-item {
            padding-inline-start: 0;
          }
          .item-header {
            display: none;
          }
        }
      }
  
      .nav-list-item, .nav-item {
        height: em(40px);
        border-bottom: em(1px) solid lighten(#2090D4, 40);
        display: flex;
        align-items: center;
        cursor: pointer;
        // padding-inline-start: em(5px);
        padding: em(5px);
  
        &.dropable {
          // background-color: red;
        }
  
      }
      .inner-list-item, .nav-item {
        // padding-inline-start: em(38px);
        border-bottom: em(1px) solid rgba(91, 91, 91, 0.2);
      }
      .system-nav {
        .inner-list-item {
          padding-inline-start: em(30px);
        }
      }
  
      .powered-by {
        direction: ltr;
        img {
          height: em(25px);
          width: unset;
        }
      }
    }

    .organization-list {
      >*:not(:last-child) {
        // border-bottom: 1px solid rgba(128, 128, 128, 0.5);
      }
    }
   
    .blur, .toggle-btn {
      display: none;
    }
    @media (max-width: $small-screen-break) {
      position: fixed;
      padding: 0;
      .main-sidebar {
        height: calc(100vh - #{$header-height});
        max-height: calc(100vh - #{$header-height});
        background-color: var(--clr-1);
        position: fixed;
        top: $header-height;
        inset-inline-start: 0;
        transition: .3s;
      }
      .blur {
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        inset-inline-start: 0;
        background-color: #00000050;
        display: block;
      }
      .toggle-btn {
        position: fixed;
        bottom: 60px;
        inset-inline-end: 30px;
        background-color: #fff;
        padding: rem(10px);
        border-radius: 50%;
        box-shadow: $light-shadow;
        display: block;
        transition: .3s;
      }
      &.closed {
        .main-sidebar {
          inset-inline-start: -100%;
        }
        .blur {
          display: none;
        }
        .toggle-btn {
          inset-inline-end: unset;
          inset-inline-start: 30px;
        }
      }
    }
  }
}
</style>
<template>
  <div class="sidebar-container" :class="{closed: !mobileToggled}">
    <div class="blur" @click="mobileToggled = !mobileToggled"></div>
    <div class="toggle-btn" @click="mobileToggled = !mobileToggled">☰</div>
    <aside class="main-sidebar height-all flex column space-between gap10">
      <LoggedUserPreview/>
      <div class="flex column space-between side-bar-content flex-1">
        <ul class="organization-list flex-1">
          <li :class="{selected: selectedOrgId === org._id}" class="nav-item-preview organization-preview" v-for="org in organizations" :key="org._id">
            <div class="nav-list-item item-header flex align-center gap10" @click="selectOrg(org)">
              <Avatar :size="25">{{org?.name?.slice(0,2) || ''}}</Avatar>
              <p class="flex-1 flex space-between">
                <span>{{org.name}}</span>
                <span v-if="isOrgPending(org)">({{$t('pending')}})</span>
              </p>
            </div>
            <div class="flex column" v-if="selectedOrgId === org._id && isRoleInOrg('producer')">
              <router-link class="nav-list-item inner-list-item" :to="{ name: 'ReleasePage', params: { organizationId: org._id } }">
                <DropDiv :onDrop="() => addReleasesToFolder(null, null)">
                  <div class="height-all width-all flex align-center" @click="clearFolderSelecion">
                    {{$t('release.releases')}}
                  </div>
                </DropDiv>
              </router-link>
              <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: org._id } }">{{$t('contact.contacts')}}</router-link>
              <router-link v-if="isRoleInOrg('producer')" class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: org._id } }">{{$t('account.accounts')}}</router-link>
              <FoldersNav v-if="isRoleInOrg('producer')" :currentDropableFolderPath="currentDropableFolderPath" :folders="org.folders || []" :parentItem="org"/>
            </div>
          </li>
        </ul>
        <div class="nav-list-item">
          <router-link v-if="!isSingleOrgMode" class="nav-list-item item-header flex align-center gap10" :to="{name: 'JoinOrgPage'}">
            <Avatar :size="25">{{''.slice(0,2)}}</Avatar>
            <p>{{$t('organization.addOrganization')}}</p>
          </router-link>
        </div>
        <div class="nav-item-preview" v-if="isAdmin">
          <div class="nav-list-item item-header flex align-center gap10" @click="showAdminNav = !showAdminNav">
            <Avatar :size="25">{{'מגפון'.slice(0,2)}}</Avatar>
            <p>{{$t('sidebar.megaphonGeneral')}}</p>
          </div>
          <div class="flex column" v-if="showAdminNav">
            <router-link class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: '-1' } }">{{$t('contact.contacts')}}</router-link>
            <router-link class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: '-1' } }">{{$t('account.accounts')}}</router-link>
            <router-link class="nav-list-item inner-list-item" :to="{ name: 'OrganizationPage' }">{{$t('organization.organizations')}}</router-link>
          </div>
        </div>
        
        <div class="nav-list-item">
          <router-link class="nav-list-item item-header flex align-center gap10" :to="{name: 'SettingsPage'}">
            <p>{{$t('settings.settings')}}</p>
          </router-link>
        </div>
      </div>
      <div class="side-bar-footer">
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
export default {
  components: { Avatar, FoldersNav, DropDiv, LoggedUserPreview },
  name: 'SideBar',
  data() {
    return {
      showAdminNav: false,
      showFolders: false,
      showActionsModal: false,
      mobileToggled: false
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

//       // @media (max-width: $small-screen-breake) {
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
    .main-sidebar {
      height: calc(100vh - #{$header-height} - 22px);
      max-height: calc(100vh - #{$header-height} - 22px);
      .side-bar-content {
        max-height: calc(100% - #{em(80px)});
        height: calc(100% - #{em(80px)});
        overflow-y: auto;
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
  
      width: em(250px);
  
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

      .logged-user-preview {
          padding: em(10px);
      }
  
      .nav-item-preview {
        .nav-list-item {
          &:hover {
            background-color: var(--clr-5) !important;
            color: var(--clr-1);
          }
        }
  
        &.selected {
          .item-header {
            background-color: var(--clr-4);
            color: var(--clr-1);
          }
          .router-link-active {
            // background-color: rgba(147, 214, 254, 0.3);
            background-color: var(--clr-5);
            color: var(--clr-0);
          }
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
  
      .nav-list-item {
        height: em(40px);
        border-bottom: em(1px) solid lighten(#2090D4, 40);
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-inline-start: em(2px);
  
        &.dropable {
          // background-color: red;
        }
  
      }
      .inner-list-item {
        padding-inline-start: em(50px);
        border-bottom: em(1px) solid rgba(91, 91, 91, 0.2);
      }
  
      .powered-by {
        direction: ltr;
        img {
          height: em(25px);
          width: unset;
        }
      }
    }
   
    .blur, .toggle-btn {
      display: none;
    }
    @media (max-width: $small-screen-breake) {
      position: fixed;
      padding: 0;
      .main-sidebar {
        height: calc(100vh - #{$header-height});
        max-height: calc(100vh - #{$header-height});
        background-color: #fff;
        position: fixed;
        top: $header-height;
        right: 0;
        transition: .3s;
      }
      .blur {
        height: 100vh;
        width: 100vw;
        position: fixed;
        top: 0;
        right: 0;
        background-color: #00000050;
        display: block;
      }
      .toggle-btn {
        position: fixed;
        bottom: 60px;
        left: 30px;
        background-color: #fff;
        padding: rem(10px);
        border-radius: 50%;
        box-shadow: $light-shadow;
        display: block;
        transition: .3s;
      }
      &.closed {
        .main-sidebar {
          right: -100%;
        }
        .blur {
          display: none;
        }
        .toggle-btn {
          left: unset;
          right: 30px;
        }
      }
    }
  }
}
</style>
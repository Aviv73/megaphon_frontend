<template>
  <div class="sidebar-container" :class="{closed: !mobileToggled}">
    <div class="blur" @click="mobileToggled = !mobileToggled"></div>
    <div class="toggle-btn" @click="mobileToggled = !mobileToggled">☰</div>
    <aside class="main-sidebar height-all flex column space-between gap10">
      <div class="flex column gap10">
        <div v-if="loggedUser" class="sidebar-header flex align-center space-between">
          <span>{{$t('hello')}}, {{`${loggedUser.firstName} ${loggedUser.lastName}`}}</span>
          <div class="actions-section" @click="showActionsModal = !showActionsModal" @mouseoverr="showActionsModal = true" @mouseleavee="showActionsModal = false">
            <img class="avatar" :src="require('@/apps/megaphonApp/assets/images/avatar_black.svg')" alt="">
            <div class="actions-modal" v-if="showActionsModal">
              <div class="top-like"></div>
              <button @click="logout">{{$t('auth.logout')}}</button> | 
              <router-link :to="{ name: 'AccountEditModal', params: { id: loggedUser._id } }">{{$t('auth.editUserDetails')}}</router-link>
            </div>
          </div>
        </div>
        <ul class="organization-list flex-1">
          <li :class="{selected: selectedOrgId === org._id}" class="organization-preview" v-for="org in organizations" :key="org._id">
            <div class="nav-list-item org-header flex align-center gap10" @click="selectOrg(org._id)">
              <Avatar :size="25">{{org.name.slice(0,2)}}</Avatar>
              <p>{{org.name}}</p>
            </div>
            <div class="flex column" v-if="selectedOrgId === org._id">
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
          <li class="organization-preview" v-if="isAdmin">
            <div class="nav-list-item org-header flex align-center gap10" @click="showAdminNav = !showAdminNav">
              <Avatar :size="25">{{'מגפון'.slice(0,2)}}</Avatar>
              <p>{{$t('sidebar.megaphonGeneral')}}</p>
            </div>
            <div class="flex column" v-if="showAdminNav">
              <router-link class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: '-1' } }">{{$t('contact.contacts')}}</router-link>
              <router-link class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: '-1' } }">{{$t('account.accounts')}}</router-link>
              <router-link class="nav-list-item inner-list-item" :to="{ name: 'OrganizationPage' }">{{$t('organization.organizations')}}</router-link>
            </div>
          </li>
          <li class="nav-list-item">
            <router-link :to="{name: 'SettingsPage'}">
              {{$t('settings.settings')}}
            </router-link>
          </li>
        </ul>
      </div>
      <div class="powered-by flex align-end space-between gap10">
        <!-- Powered by Megaphon -->
        <p>Powered by</p> <img :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      </div>
    </aside>
  </div>
</template>



<script>
import Avatar from '../../../../../common/modules/common/cmps/Avatar.vue';
import FoldersNav from './FoldersNav.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import DropDiv from '../dnd/DropDiv.vue';
import { organizationService } from '../../../organization/services/organization.service';
export default {
  components: { Avatar, FoldersNav, DropDiv },
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
    }
  },
  methods: {
    isRoleInOrg(role) {
      return organizationService.isUserRoleInOrg(this.selectedOrgId, role, this.loggedUser);
    },
    selectOrg(orgId) {
      this.$router.push({ name: 'ReleasePage', params: { organizationId: orgId } });
      this.showFolders = false;
      // this.$emit('selectOrganization', orgId);
    },

    clearFolderSelecion() {
      evManager.emit('folder-selected', null, null);
    },

    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'LoginPage' });
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
.dark-theme .megaphon-app {
  .sidebar-container .main-sidebar {
    color: #cecece;
    .sidebar-header {
      .avatar {
        background-color: #2090D4;
      }
    }
    .organization-preview {
      .nav-list-item {
        &:hover {
          background-color: lighten($color: #2090D4, $amount: 20%) !important;
        }
      }

      &.selected {
        .org-header {
          background-color: #2090D4;
          // color: #2090D4
          color: white
        }
        .router-link-active {
          background-color: rgba(147, 214, 254, 0.3);
          color: #2090D4;
        }
      }
    }
    .nav-list-item {
      border-bottom: em(0.5px) solid #003d5e;
    }
  }
}
.megaphon-app {
  .sidebar-container {
    position: relative;
    z-index: 5;
    .main-sidebar {
      height: calc(100vh - #{$header-height} - 22px);
      overflow-y: auto;
      color: #2090D4;
      position: sticky;
      top: calc(#{$header-height} + 0px);
      
      padding: em(10px);
      // height: auto;
  
      width: em(250px);
      .sidebar-header {
        width: 100%;
        .avatar {
          width: em(30px);
          height: em(30px);
          background-color: black;
          border-radius: 50%;
        }
        .actions-section {
          position: relative;
          cursor: pointer;
          .actions-modal {
            // display: none;
            position: absolute;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: em(10px);
            left: 50%;
            transform: translateX(-50%);
            bottom: calc(-100% - #{em(15px)});
            background: #fff;
            border-radius: em(5px);
            box-shadow: $light-shadow;
            padding: em(10px);
            color: #808080;
            >* {
              text-wrap: nowrap;
            }
            >*:not(.top-like):hover {
              transform: .3s;
              transform: scale(1.02);
            }
            .top-like {
              position: absolute;
              background-color: #fff;
              position: absolute;
              top: 0;
              left: 50%;
              transform: translate(-50%, -50%) rotate(45deg);
  
              width: em(10px);
              height: em(10px);
              // box-shadow: $light-shadow;
              z-index: -1;
            }
          }
        }
      }
  
      .app-avatar {
       color: white;
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
  
      .organization-preview {
        .nav-list-item {
          &:hover {
            background-color: #F5F5F5 !important;
          }
        }
  
        &.selected {
          .org-header {
            background-color: #BCDDF2;
          }
          .router-link-active {
            background-color: rgba(147, 214, 254, 0.3);
            color: black;
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
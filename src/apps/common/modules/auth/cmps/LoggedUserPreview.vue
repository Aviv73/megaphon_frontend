<template>
  <div v-if="loggedUser" :style="{'--preview-clr': theme?.colors?.[0] || 'black'}" class="logged-user-preview flex column gap5 space-around">
    <div class="flex align-center space-between gap5">
      <span class="wellcome-msg">{{$t('hello')}}, {{`${loggedUser.firstName} ${loggedUser.lastName}`}}</span>
      <div class="actions-section" @click="showActionsModal = !showActionsModal" @mouseoverr="showActionsModal = true" @mouseleavee="showActionsModal = false">
        <!-- <img class="avatar" :src="require('@/apps/megaphonApp/assets/images/avatar_black.svg')" alt=""> -->
        <div class="avatar img" v-html="avatarIco"></div>
        <!-- <img class="avatar" :src="require('@/apps/megaphonApp/assets/images/avatar_black.svg')" alt=""> -->
        <div class="blure" v-if="showActionsModal && !viewAsModal" @click.stop.prevent="showActionsModal = false"></div>
        <component :is="viewAsModal? 'Modal' : 'div'" class="actions-modal" @close="showActionsModal = false" v-if="showActionsModal" :fullScreen="true">
          <div class="top-like" v-if="!viewAsModal"></div>
          <button class="logout-btn" @click="logout">{{$t('authLocales.logout')}}</button>
          <span class="sep-span"> | </span>
          <router-link class="edit-btn ignore-theme-style" :to="{ name: 'AccountEditModal', params: { id: loggedUser._id } }">{{$t('authLocales.editUserDetails')}}</router-link>
        </component>
      </div>
    </div>
    <p class="roles" v-if="bestOrgRole && accountOrgData?.roles?.length">
      <!-- [{{accountOrgData.roles.map(c => $t(`organizationLocales.orgRoles.${c}`)).join(', ')}}] -->
      [{{$t(`organizationLocales.orgRoles.${bestOrgRole}`)}}]
    </p>
  </div>
</template>

<script>
import  { getSvgs } from '@/assets/images/svgs.js';
import Modal from '../../common/cmps/Modal.vue';
import { organizationService } from '../../organization/organization.service';
import { consts } from '@/apps/common/modules/common/services/const.service.js';
export default {
  components: { Modal },
  name: 'LoggedUserPreview',
  props: {
    viewAsModal: [Boolean],
    organizationId: [String]
  },
  data() {
    return {
      showActionsModal: false 
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    theme() {
      return this.$store.getters.selectedTheme;
    },
    avatarIco() {
      // const clr = theme?.colors?.[1] || 'black';
      const clr = 'var(--preview-clr)';
      return getSvgs(clr).icons.avatar; 
    },
    accountOrgData() {
      if (!this.organizationId) return null;
      return organizationService.getOrgItemInAccount(this.loggedUser, this.organizationId);
    },
    bestOrgRole() {
      if (!this.accountOrgData) return '';
      return this.accountOrgData.roles?.sort((a, b) => {
        return (consts.organizationRolesMap[a] || 1000) - (consts.organizationRolesMap[b] || 1000);
      })[0] || '';
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'LoginPage' });
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme { // MOVED
//   .logged-user-preview {
    // .avatar {
//     .avatar {
//       background-color: var(--clr-4);
//     }
//   }
// }
// .megaphon-app {
  .logged-user-preview {
    background-color: var(--clr-4); //black
    color: var(--preview-clr);
    background-color: var(--clr-3); //black
    color: var(--preview-clr);
    // padding: em(10px);
    width: 100%;
    // .avatar {
    position: relative;
    z-index: 11;
    .avatar {
      width: em(30px);
      height: em(30px);
      // background-color: var(--clr-0); //black
      border-radius: 50%;
    }
    .actions-section {
      .blure {
        position: fixed;
        z-index: 35;
        top: 0;
        inset-inline-start: 0;
        width: 100vw;
        height: 100vh;
        background-color: $blure-clr;
      }
      position: relative;
      cursor: pointer;
      .actions-modal:not(.modal-container) {
        // display: none;
        position: absolute;
        z-index: 36;
        display: flex;
        align-items: center;
        gap: em(10px);
        inset-inline-end: 50%;
        transform: translateX(-50%);
        bottom: calc(-100% - #{em(15px)});
        background: #fff;
        border-radius: em(5px);
        box-shadow: $light-shadow;
        padding: em(10px);
        color: #808080;
        >* {
          text-wrap: nowrap;
          color: #808080;
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
          inset-inline-end: 50%;
          transform: translate(-50%, -50%) rotate(45deg);

          width: em(10px);
          height: em(10px);
          // box-shadow: $light-shadow;
          z-index: -1;
        }
      }
    }
    
    
    &.to-the-right {
      .actions-section {
        .actions-modal {
          .top-like {
            // display: none;
            top: 50%;
            inset-inline-end: 0;
            transform: translate(-50%, -50%) rotate(45deg);
          }
          inset-inline-end: calc(100% + #{em(10px)});
          transform: translateY(50%);
          bottom: 50%;
        }
      }
    }
  }
// }
</style>
<template>
  <aside class="app-aside sticky flex column wide-screen-item">
    <div class="org-logo">
      <img class="actual" :src="fixFileSrcToThumbnail(org.logo, org)" :alt="org.name">
    </div>
    <div class="account-preview" v-if="loggedUser" :style="{'background-color': headerBg, color: headerColor}">
      <LoggedUserPreview :class="{'no-auth': !org?.requireAuth}"/>
    </div>
    <CostumeNavBar/>
  </aside>
</template>

<script>
import CostumeNavBar from '../../../common/modules/common/cmps/CostumeNavBar.vue';
import LoggedUserPreview from '../../../common/modules/auth/cmps/LoggedUserPreview.vue';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';

export default {
  components: { CostumeNavBar, LoggedUserPreview },
  name: "streamTv_AppAside",
  computed: {
    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    },
    headerBg() {
      return this.selectedTheme.colors?.[3];
    },
    headerColor() {
      return this.selectedTheme.colors?.[2];
    }
  },
  methods: {
    fixFileSrcToThumbnail
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .app-aside {
    background-color: var(--clr-1);
    color: var(--clr-0);
    top: 0;
    max-height: 100vh;
    width: var(--aside-width);
    font-size: em(13px);
    .org-logo {
      
      // width: em(150px);
      // height: $header-height;
      height: var(--header-height);
      padding: em(10px);
      .actual {
        height: 100%;
        object-fit: contain;
      }
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    .costume-nav-bar {
      width: 100%;
      gap: 0;
      flex-direction: column;
      .nav-item {
        width: 100%;
        height: fit-content;
        display: flex;
        align-items: center;
        // justify-content: center;
        padding: em(10px);
        &:not(:last-child) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        // &:hover {
        //   transform: unse;
        // }
      }
    }

    .account-preview {
      // padding: em(20px) em(10px);
      .logged-user-preview {
        padding: em(10px) em(5px);
        // align-items: flex-start;
        .avatar {
          // background-color: var(--clr-4);
          background-color: unset;
        }
        .actions-modal {
          .edit-btn {
            display: none;
          }
        }

        &.no-auth {
          display: none;
          // .actions-section {
          //   display: none;
          // }
        }
        .avatar {
          width: em(25px);
          height: em(25px);
        }
        .wellcome-msg {
          font-size: em(13px);
        }
      }
    }
  }
}
</style>
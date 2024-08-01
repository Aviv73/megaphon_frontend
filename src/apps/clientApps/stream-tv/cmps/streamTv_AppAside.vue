<template>
  <aside class="app-aside sticky flex column wide-screen-item">
    <div class="org-logo">
      <img class="actual" :src="org.logoUrl" :alt="org.name">
    </div>
    <div class="account-preview" v-if="loggedUser" :style="{'background-color': headerBg, color: headerColor}">
      <span>{{$t('hello')}}, {{`${loggedUser.firstName} ${loggedUser.lastName}`}}</span>
    </div>
    <CostumeNavBar/>
  </aside>
</template>

<script>
import CostumeNavBar from '../../../common/modules/common/cmps/CostumeNavBar.vue';
export default {
  components: { CostumeNavBar },
  name: "streamTv_AppAside",
  computed: {
    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    loggedUser() {
      return { 
        firstName: 'אביב',
        lastName: 'יששכר'
      }
      return this.$store.getters['auth/loggedUser'];
    },
    headerBg() {
      return this.org?.designPreferences?.colorsPalate?.[3];
    },
    headerColor() {
      return this.org?.designPreferences?.colorsPalate?.[2];
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .app-aside {
    top: 0;
    max-height: 100vh;
    .org-logo {
      // width: 60px;
      height: $header-height;
      .actual {
        height: 100%;
      }
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
      padding: em(20px) em(10px);
    }
  }
}
</style>
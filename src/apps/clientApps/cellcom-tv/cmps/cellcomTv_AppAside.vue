<template>
  <aside class="app-aside sticky flex column wide-screen-item">
    <div class="org-logo">
      <img class="actual" :src="org.logoUrl" :alt="org.name">
    </div>
    <CostumeNavBar/>
  </aside>
</template>

<script>
import CostumeNavBar from '../../../common/modules/common/cmps/CostumeNavBar.vue';
export default {
  components: { CostumeNavBar },
  name: "cellcomTv_AppAside",
  computed: {
    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.cellcomTv-app {
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
        padding: em(5px);
        &:not(:last-child) {
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        // &:hover {
        //   transform: unse;
        // }
      }
    }
  }
}
</style>
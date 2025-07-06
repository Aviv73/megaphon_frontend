<template>
  <div class="auth-app flex align-center justify-center container_ inner-app" :style="{backgroundImage: rootOrg? `url(${fixFileSrcToThumbnail(rootOrg.designPreferences.loginPage[0].bgImg, rootOrg)})` : '' }">
    <div class="inner-app-content flex column gap30">
      <img class="logo" :class="{ 'org-logo': rootOrg }" :src="appLogo" :alt="org?.name || 'Megaphon'">
      <p v-if="rootOrg?.designPreferences?.loginPage?.[0]?.msg" v-html="`<p>${rootOrg?.designPreferences?.loginPage?.[0]?.msg.split('\n').join('</p><p>')}</p>`" class="flex column align-center gap5_ text-center"></p>
      <router-view class=""/>
    </div>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import { fixFileSrcToThumbnail } from '../common/services/file.service';
import appConfig from '../../../../appConfig';

export default {
  name: 'AuthApp',
  computed: {
    isLoading() {
      return this.$store.getters['auth/isLoading'];
    },
    rootOrg() {
      return this.$store.getters.rootOrg;
    },
    appLogo() {
      // return this.org?.logo? fixFileSrcToThumbnail(this.org?.logo, this.org) : require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png');
      return this.rootOrg?.logo? fixFileSrcToThumbnail(this.rootOrg?.logo, this.rootOrg) : this.$store.getters.envManagement?.logo || require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png');
    },
    org() {
      return appConfig.appOrganization || this.$store.getters['organization/selectedItem'];
    }
  },
  methods: {
    fixFileSrcToThumbnail
  },
  components: {
    Loader
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.auth-app {
  
  background-repeat: no-repeat;
  background-size: cover;
  align-items: center !important;

  .inner-app-content {
    max-width: rem(500px);
    // margin: 0 auto;
    width: fit-content;
    height: fit-content !important;
    background-color: var(--clr-1);
    flex: unset !important;
    padding: em(20px);
    border-radius: em(3px);
    box-shadow: $light-shadow;
  }

  
  .logo {
    // width: 50%;
    height: em(50px);
    width: auto;
    object-fit: contain;
    // &.org-logo {
      align-self: center;
      // width: rem(100px);
    // }
  }

  .auth-page {
    .simple-form {
      // width: em(400px);
      // max-width: 90vw;
      gap: em(10px);
      .label {
        width: em(150px);
      }
    }
  }
}
</style>
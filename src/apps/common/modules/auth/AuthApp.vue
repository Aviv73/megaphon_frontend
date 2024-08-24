<template>
  <div class="auth-app flex align-center justify-center container_ inner-app" :style="{backgroundImage: rootOrg? `url(${fixFileSrcToThumbnail(rootOrg.designPreferences.loginPage[0].bgImg)})` : '' }">
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import { fixFileSrcToThumbnail } from '../common/services/file.service';
export default {
  name: 'AuthApp',
  computed: {
    isLoading() {
      return this.$store.getters['auth/isLoading'];
    },
    rootOrg() {
      return this.$store.getters.rootOrg;
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
    width: fit-content;
    height: fit-content !important;
    background-color: var(--clr-1);
    flex: unset !important;
    padding: em(20px);
    border-radius: em(3px);
    box-shadow: $light-shadow;
  }
}
</style>
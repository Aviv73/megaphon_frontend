<template>
  <footer class="app-footer">
    <div class="container flex space-between align-center wrap gap20">
      <AppCreditsSection/>
      <div class="flex gap20 align-center space-between wrap">
        <div>
          {{org?.designPreferences?.contactMsg || ''}}
        </div>
        <div class="flex align-center gap20" v-if="org?.mediaLinks?.length">
          <span>{{$t('contact')}} {{org.name}}</span>
          <OrgMediaLinks :organization="org" :color="selectedTheme?.colors?.[2]" :imgs="mediaSvgs"/>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import OrgMediaLinks from '@/apps/common/modules/organization/cmps/OrgMediaLinks/OrgMediaLinks.vue'
import { getSvgs } from '../assets/images/svgs';
import AppCreditsSection from '../../../common/modules/common/cmps/AppCreditsSection.vue';
export default {
  components: { OrgMediaLinks, AppCreditsSection },
  name: "streamTv_AppFooter",
  computed: {
    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    },
    mediaSvgs() {
      return getSvgs(this.selectedTheme?.colors?.[2]).media;
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .app-footer {
    padding: em(20px) 0;
    @media (max-width: $small-screen-break) {
      text-align: center;
      .container {
        flex-direction: column-reverse;
        // flex-wrap: wrap-reverse;
      }
    }
  }
}
</style>
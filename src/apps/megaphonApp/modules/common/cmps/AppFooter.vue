<template>
  <footer class="app-footer flex">
    <div class="full-screen-container flex align-center space-between height-all width-all">
      <AppCreditsSection/>
      <div class="flex align-center" v-if="false || true">
        <div class="flex align-center gap20" v-if="org?.mediaLinks?.length">
          <span>{{$t('contact')}} {{org.name}}</span>
          <OrgMediaLinks :organization="org" :color="selectedTheme?.colors?.[2]" :imgs="mediaSvgs"/>
        </div>
        <div>
          {{org?.designPreferences?.contactMsg || ''}}
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import OrgMediaLinks from '@/apps/common/modules/organization/cmps/OrgMediaLinks.vue'
import { getSvgs } from '@/apps/clientApps/stream-tv/assets/images/svgs';
import AppCreditsSection from '../../../../common/modules/common/cmps/AppCreditsSection.vue';
export default {
  name: "AppFooter",
  components: { OrgMediaLinks, AppCreditsSection },
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
.megaphon-app {
  .app-footer {
    min-height: rem(60px);
    font-size: rem(14px);
    padding: rem(20px);
    .powered-by {
        direction: ltr;
        img {
          height: em(25px);
          width: unset;
        }
    }
  }
}
</style>
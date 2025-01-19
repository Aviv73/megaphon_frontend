<template>
  <footer class="app-footer flex">
    <div class="container flex align-center space-between height-all width-all">
      <div class="flex align-center">
        <div class="flex align-center gap20" v-if="org?.mediaLinks?.length">
          <span>{{$t('contact')}} {{org.name}}</span>
          <OrgMediaLinks :organization="org" :color="selectedTheme?.colors?.[2]" :imgs="mediaSvgs"/>
        </div>
        <div>
          {{org?.designPreferences?.contactMsg || ''}}
        </div>
      </div>
      <div class="powered-by flex align-end gap10">
        <!-- Powered by Megaphon -->
        <p>Powered by</p> <img :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      </div>
    </div>
  </footer>
</template>

<script>
import OrgMediaLinks from '@/apps/common/modules/organization/cmps/OrgMediaLinks/OrgMediaLinks.vue'
import { getSvgs } from '@/apps/clientApps/stream-tv/assets/images/svgs';
export default {
  name: "AppFooter",
  components: { OrgMediaLinks },
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
    height: rem(60px);
    font-size: 0.6rem;
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
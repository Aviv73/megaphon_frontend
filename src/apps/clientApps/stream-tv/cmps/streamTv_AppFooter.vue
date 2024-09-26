<template>
  <footer class="app-footer">
    <div class="container flex space-between align-center wrap gap20">
      <div>
        {{org?.designPreferences?.contactMsg || ''}}
      </div>
      <div class="flex align-center gap20" v-if="org?.mediaLinks?.length">
        <span>{{$t('contact')}} {{org.name}}</span>
        <OrgMediaLinks :organization="org" :color="selectedTheme?.colors?.[2]"/>
      </div>
    </div>
  </footer>
</template>

<script>
import OrgMediaLinks from '@/apps/common/modules/organization/cmps/OrgMediaLinks/OrgMediaLinks.vue'
export default {
  components: { OrgMediaLinks },
  name: "streamTv_AppFooter",
  computed: {
    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .app-footer {
    padding: em(20px) 0;

  }
}
</style>
<template>
  <footer class="app-footer">
    <div class="container flex space-between">
      <div class="ph"></div>
      <div class="flex align-center gap20">
        <span>{{$t('contact')}} {{org.name}}</span>
        <OrgMediaLinks :organization="org" :color="org?.designPreferences?.colorsPalate?.[2]"/>
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
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.streamTv-app {
  .app-footer {
    padding: em(20px);

  }
}
</style>
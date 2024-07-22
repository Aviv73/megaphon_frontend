<template>
  <ReleasePage v-if="isReleasePage"/>
  <div v-else class="default-release-page container release-app inner-app">
    <Loader v-if="isLoading" :fullScreen="true"/>
    <div class="inner-app-content" v-else v-html="loadedHtml"></div>
    <!-- <iframe :src="'/apps/' + this.htmlFilePath" frameborder="0"></iframe> -->
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import { loadStaticFile } from '@/apps/common/modules/common/services/file.service';
import ReleasePage from '@/apps/common/modules/release/views/common_ReleasePage.vue';
export default {
  name: 'default_CostumePage',
  components: { ReleasePage, Loader },
  data() {
    return {
      loadedHtml: '',
      isLoading: false
    }
  },
  computed: {
    pageNameInRoute() {
      return this.$route.query.page;
    },
    org () {
      return this.$store.getters['organization/selectedItem'];
    },
    allRouteFilters() {
      return this.org?.routes || [];
    },
    routeItem() {
      return this.allRouteFilters.find(c => c.name === this.pageNameInRoute) || {};
    },
    isReleasePage() {
      return !!this.routeItem.releaseFilter?.releaseTypes?.length;
    },
    htmlFilePath() {
      return this.routeItem.htmlContentFilePath;
    }
  },
  methods: {
    async loadHtml() {
      this.isLoading = true;
      this.loadedHtml = await loadStaticFile(this.htmlFilePath);
      this.isLoading = false;
    }
  },
  created() {
    if (!this.htmlFilePath) return;
    this.loadHtml();
  },
  watch: {
    htmlFilePath(val) {
      if (val) this.loadHtml();
    }
  }
}
</script>

<style>

</style>
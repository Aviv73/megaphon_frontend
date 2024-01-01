<template>
  <ReleasePage v-if="isReleasePage"/>
  <div v-else class="container release-app inner-app">
    <Loader v-if="isLoading" :fullScreen="true"/>
    <div v-else v-html="loadedHtml"></div>
  </div>
</template>

<script>
import Loader from '../../../../../common/modules/common/cmps/Loader.vue';
import { loadStaticFile } from '../../../../../common/modules/common/services/file.service';
import ReleasePage from '../../release/views/default_ReleasePage.vue';
export default {
  name: 'default_ReleasePage',
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
  watch: {
    htmlFilePath(val) {
      if (val) this.loadHtml();
    }
  }
}
</script>

<style>

</style>
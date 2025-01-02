<template>
  <ReleasePage v-if="isReleasePage"/>
  <div v-else class="container release-app inner-app">
    <Loader v-if="isLoading" :fullScreen="true"/>
    <div class="inner-app-content" v-else v-html="loadedHtml"></div>
    <!-- <iframe :src="'/apps/' + this.htmlFilePath" frameborder="0"></iframe> -->
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import { loadStaticFile, loadCostumeHtml } from '@/apps/common/modules/common/services/file.service';
import ReleasePage from '@/apps/common/modules/release/views/common_ReleasePage.vue';
import { organizationService } from '../../../../megaphonApp/modules/organization/services/organization.service';
export default {
  name: 'common_CostumePage',
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
    requiresRoutesRoles() {

    },
    
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    requiresRoutesRoles() {
      return this.$route.meta.routesRoles;
    },
    allRouteFilters() {
      return organizationService.getOrgRoutesByRoles(this.org, this.requiresRoutesRoles || organizationService.getOrgItemInAccount(this.loggedUser, this.org._id)?.roles);
      // return this.org?.routes?.filter(c => c.showInRoles?.includes('client')) || [];
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
      // this.loadedHtml = await loadStaticFile(this.htmlFilePath);
      this.loadedHtml = await loadCostumeHtml(this.org._id, this.htmlFilePath);
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
<template>
  <div class="costume-nav-bar flex aign-center wrap gap30_">
    <router-link 
      v-for="filterItem in allRouteFilters" :key="filterItem.id"
      :to="{ name: 'CostumePage', query: { page: filterItem.name  }, ...(baseRoute || {}) }"
      class="nav-item"
      :class="{ selected: $route.query.page === filterItem.name }"
    >
      <p class="hover-pop nav-item-msg flex align-center gap10">
        <span v-if="beforeSvg" v-html="beforeSvg" class="svg-parrent"></span>
        {{filterItem.name}}
      </p>
    </router-link>
  </div>
</template>

<script>
import { organizationService } from '../../organization/organization.service';
export default {
  name: 'CostumeNavBar',
  props: {
    filterRoutes: Function,
    baseRoute: Object,
    routeRoles: Array,
    beforeSvg: String
  },
  computed: {
   org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    allRouteFilters() {
      const routes = organizationService.getOrgRoutesByRoles(this.org, this.routeRoles || ['client']).filter(c => !c.hideFromUi);
      if (!this.filterRoutes) return routes;
      return routes.filter(this.filterRoutes);
    },
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';
.costume-nav-bar {
  a {
    font-weight: normal;
    &.selected {
      font-weight: bold;
    }
  }
}
</style>
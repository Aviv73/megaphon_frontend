<template>
  <div class="costume-nav-bar flex aign-center wrap gap30">
    <router-link 
      v-for="filterItem in allRouteFilters" :key="filterItem.id"
      :to="{ name: 'CostumePage', query: { page: filterItem.name  } }"
      class="nav-item"
      :class="{ selected: $route.query.page === filterItem.name }"
    >
      <p class="hover-pop">
        {{filterItem.name}}
      </p>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'CostumeNavBar',
  computed: {
   org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    allRouteFilters() {
      return this.org?.routes?.filter(c => c.showInRoles?.includes('client')) || [];
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
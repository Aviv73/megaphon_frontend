<template>
  <section class="common-release-page inner-container main-pad-y_ flex-1 flex column gap30 height-all width-all flex column">
    <!-- <h2>{{$t('releaseLocales.releases')}}</h2> -->
    <div class="" v-if="!allReleasesData.items.length" style="height: 3em"></div>
    <ReleasesSlider :releases="allReleasesData.items"/>
    <ItemSearchList
      class="flex-1 height-all container"
      :itemsData="allReleasesData"
      :initFilterBy="filterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
      :dontRoute="false"
      layoutMode="flex"
    />
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ReleasePreview from '../cmps/common_ReleasePreview.vue';
import ReleaseFilter from '../cmps/common_ReleaseFilter.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import ReleasesSlider from '../cmps/ReleasesSlider.vue';
import { templateUtils } from '../../common/services/template.util.service';
import { organizationService } from '../../../../megaphonApp/modules/organization/services/organization.service';
export default {
  name: 'common_ReleasePage',
  data() {
    return {
      ReleasePreview,
      ReleaseFilter
    }
  },
  methods: {
    getAllReleases(filterBy) {
      const filterToSend = !(this.noPageMode)? JSON.parse(JSON.stringify({...(filterBy || this.filterBy || {}) })) : { releaseFilter: { releaseTpes: templateUtils.getAllReleaseTypesForOrg(this.org).map(c => c.id), wasDistributed: undefined /*true*/ } }
      // filterToSend.params.page = this.page;
      this.$store.dispatch({ type: 'release/loadItems', filterBy: filterToSend, orgFilter: this.routeItem.releaseFilter });
    }
  },
  computed: {
    allReleasesData() {
      return this.$store.getters['release/data'];
    },
    filterBy() {
      return this.$store.getters['release/filterBy'];
    },
    isLoading() {
      return this.$store.getters['release/isLoading'] || this.$store.getters['organization/isLoading'];
    },
    releasePageInQuery() {
      return this.$route.query.page;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },

    requiresRoutesRoles() {
      return this.$route.meta.routesRoles;
    },
    
    org () {
      return this.$store.getters['organization/selectedItem'];
    },
    allRouteFilters() {
      // return this.org?.routes || [];
      return organizationService.getOrgRoutesByRoles(this.org, this.requiresRoutesRoles || organizationService.getOrgItemInAccount(this.loggedUser, this.org._id)?.roles);
    },
    routeItem() {
      const typeName = this.releasePageInQuery;
      const defaultRoute = this.allRouteFilters.find(c => c.default);
      const routeItem = this.allRouteFilters.find(c => c.name === typeName) || defaultRoute || {};
      return routeItem;
    },
    noPageMode() {
      return this.$route.query.page == 0;
    }
  },
  created() {
    // this.getAllReleases()
    // this.$store.commit({ type: 'release/resetFilter' });
  },
  watch: {
    org: {
      deep: true,
      handler() {
        this.getAllReleases();
      }
    },
    releasePageInQuery(val, prev) {
      if (!val || !prev) return;
      const newFilter = JSON.parse(JSON.stringify(this.filterBy));
      if (!newFilter.filter) return;
      newFilter.filter.params.type = newFilter.filter.params.subType = '';
      this.$store.commit({ type: 'release/resetFilter' });
      this.getAllReleases(newFilter);
    },
    'filterBy': {
      deep: true,
      handler(val, prev) {
        if (!prev) return;
        if ((val?.filter?.params.type != prev?.filter?.params.type)) {
          const newFilter = JSON.parse(JSON.stringify(this.filterBy));
          if (!newFilter.filter) return;
          newFilter.filter.params.subType = '';
          this.getAllReleases(newFilter);
        }
        // this.$store.commit({ type: 'release/resetFilter' });
      }
    }
  },
  components: { ReleasePreview, ReleaseFilter, ItemSearchList, Loader, ReleasesSlider }
}
</script>

<style lang="scss">
// .defaultApp {
  .common-release-page {
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }
  }
// }
</style>
<template>
  <section class="release-page inner-container main-pad-y flex column height-all width-all flex column">
    <!-- <h2>{{$t('release.releases')}}</h2> -->
    <ItemSearchList
      :itemsData="allReleasesData"
      :initFilterBy="filterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
      :dontRoute="false"
    />
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ReleasePreview from '../cmps/common_ReleasePreview.vue';
import ReleaseFilter from '../cmps/common_ReleaseFilter.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
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
      const filterToSend = JSON.parse(JSON.stringify({...(filterBy || this.filterBy || {}) }));
      // filterToSend.params.page = this.page;
      this.$store.dispatch({ type: 'release/loadItems', filterBy: filterToSend, orgFilter: this.orgFilter.releaseFilter });
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
      return this.$store.getters['release/isLoading'];
    },
    releasePageInQuery() {
      return this.$route.query.page;
    },

    
    org () {
      return this.$store.getters['organization/selectedItem'];
    },
    allRouteFilters() {
      return this.org?.routes || [];
    },
    orgFilter() {
      const typeName = this.releasePageInQuery;
      const filterItem = this.allRouteFilters.find(c => c.name === typeName) || {};
      return filterItem;
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
      newFilter.filter.params.type = newFilter.filter.params.subType = '';
      this.$store.commit({ type: 'release/resetFilter' });
      this.getAllReleases(newFilter);
    },
    'filterBy': {
      deep: true,
      handler(val, prev) {
        if (!prev) return;
        if ((val?.filter.params.type != prev?.filter.params.type)) {
          const newFilter = JSON.parse(JSON.stringify(this.filterBy));
          newFilter.filter.params.subType = '';
          this.getAllReleases(newFilter);
        }
        // this.$store.commit({ type: 'release/resetFilter' });
      }
    }
  },
  components: { ReleasePreview, ReleaseFilter, ItemSearchList, Loader }
}
</script>

<style lang="scss">
.default-app {
  .release-page {
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }
  }
}
</style>
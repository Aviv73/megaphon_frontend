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
      layoutMode="grid"
    />
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ReleasePreview from '../cmps/agam_ReleasePreview.vue';
import ReleaseFilter from '../cmps/agam_ReleaseFilter.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'agam_ReleasePage',
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
      this.$store.dispatch({ type: 'release/loadItems', filterBy: filterToSend, orgFilter: this.orgFilter });
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
    orgFilter() {
      switch (this.releasePageInQuery) {
        case 'monthly':
          return {releaseTypes: ['643eb005afc5d349300c0881']}
        case 'book':
          return {releaseTypes: ['643eac15afc5d349300c087e']}
        default:
          return {}
      }
    }
  },
  created() {
    // this.getAllReleases()
    // this.$store.commit({ type: 'release/resetFilter' });
  },
  watch: {
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
.agam-app {
  .release-page {
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
        gap: 40px;
      }
    }
  }
}
</style>
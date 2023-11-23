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
      const filterToSend = {...(filterBy || this.filterBy || {}) };
      // filterToSend.params.releaseType = this.releaseType;
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
    releaseTypeInQuery() {
      return this.$route.query.releaseType;
    },
    orgFilter() {
      switch (this.releaseTypeInQuery) {
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
    this.getAllReleases()
  },
  watch: {
    '$route.query.releaseType'() {
      this.getAllReleases()
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
      }
    }
  }
}
</style>
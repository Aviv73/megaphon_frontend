<template>
  <section class="release-page flex column height-all width-all flex column">
    <!-- <h2>{{$t('release.releases')}}</h2> -->
    <ItemSearchList
      :itemsData="allReleasesData"
      :initFilterBy="filterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
      :showActions="false"
    />
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import ReleasePreview from '../cmps/ReleasePreview.vue';
import ReleaseFilter from '../cmps/ReleaseFilter.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';

export default {
  name: 'ReleasePage',
  data() {
    return {
      ReleasePreview,
      ReleaseFilter,
      currOrgFilter: null,
    }
  },
  methods: {
    getAllReleases(filterBy) {
      this.$store.dispatch({ type: 'release/loadItems', filterBy, orgFilter: this.currOrgFilter, organizationId: this.$route.params.organizationId });
    },
    handleOrgReleaseFilter(orgFilter) {
      this.currOrgFilter = orgFilter;
      this.getAllReleases();
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    allReleasesData() {
      return this.$store.getters['release/data'];
    },
    filterBy() {
      return this.$store.getters['release/filterBy'];
    },
    isLoading() {
      return this.$store.getters['release/isLoading'];
    }
  },
  created() {
    // this.getAllReleases(); // header emits filter when creates => loading releases;
    evManager.on('org-release-filter', this.handleOrgReleaseFilter);
  },
  destroyed() {
    evManager.off('org-release-filter', this.handleOrgReleaseFilter);
  },
  watch: {
    organizationId() {
      this.getAllReleases();
      this.currOrgFilter = null
    }
  },
  components: { ItemSearchList, Loader, ReleasePreview, ReleaseFilter }
}
</script>

<style lang="scss">
.megaphon-app {
  .release-page {
    padding: 10px;
    height: auto;
    .item-list {
      gap: 10px;
    }
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }
  }
}
</style>
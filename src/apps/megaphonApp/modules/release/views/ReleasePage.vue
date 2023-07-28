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
      :dontRoute="true"
    >
      <h2 v-if="selectedFolder">{{selectedFolder.name}}</h2>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
    <router-view/>
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

      selectedFolder: null
    }
  },
  methods: {
    getAllReleases(filterBy) {
      this.$store.dispatch({ type: 'release/loadItems', filterBy, orgFilter: this.currOrgFilter, folder: this.selectedFolder, organizationId: this.$route.params.organizationId });
    },
    handleOrgReleaseFilter(orgFilter) {
      this.currOrgFilter = orgFilter;
      this.getAllReleases();
    },

    handleFolderSelection(folder) {
      this.selectedFolder = folder;
      this.getAllReleases();
    }
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
    evManager.on('folder-selected', this.handleFolderSelection);
  },
  destroyed() {
    evManager.off('folder-selected', this.handleOrgReleaseFilter);
    evManager.off('folder-selected', this.handleFolderSelection);
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
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-page {
    padding: em(10px);
    height: auto;
    .item-list {
      gap: em(10px);
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
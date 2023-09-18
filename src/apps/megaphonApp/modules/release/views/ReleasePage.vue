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
      :propsToPass="{ selectedReleaseIds }"
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
  props: {
    selectedReleaseIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ReleasePreview,
      ReleaseFilter,
      currOrgFilter: null,
    }
  },
  methods: {
    getAllReleases(filterBy) {
      this.$store.dispatch({ type: 'release/loadItems', filterBy, orgFilter: this.currOrgFilter || this.organization?.filters?.[0], folder: this.selectedFolder, organizationId: this.$route.params.organizationId });
    },
    handleOrgReleaseFilter(orgFilter) {
      this.currOrgFilter = orgFilter;
      this.getAllReleases();
    },

    async handleFolderSelection(foldPath, folder) {
      this.getAllReleases();
    }
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    allReleasesData() {
      return this.$store.getters['release/data'];
    },
    filterBy() {
      return this.$store.getters['release/filterBy'];
    },
    isLoading() {
      return this.$store.getters['release/isLoading'];
    },
    selectedFolder() {
      return this.$store.getters['organization/selectedFolder']
    }
  },
  created() {
    // this.getAllReleases(); // header emits filter when creates => loading releases;
    evManager.on('org-release-filter', this.handleOrgReleaseFilter);
    evManager.on('folder-selected', this.handleFolderSelection);
  },
  destroyed() {
    evManager.off('org-release-filter', this.handleOrgReleaseFilter);
    evManager.off('folder-selected', this.handleFolderSelection);
  },
  watch: {
    organizationId() {
      this.getAllReleases();
      // this.currOrgFilter = null
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
      justify-content: space-between !important;
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
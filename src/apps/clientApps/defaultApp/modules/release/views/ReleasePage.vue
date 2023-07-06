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
    />
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ReleasePreview from '../cmps/ReleasePreview.vue';
import ReleaseFilter from '../cmps/ReleaseFilter.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'ReleasePage',
  data() {
    return {
      ReleasePreview,
      ReleaseFilter
    }
  },
  methods: {
    getAllReleases(filterBy) {
      this.$store.dispatch({ type: 'release/loadItems', filterBy });
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
    }
  },
  created() {
    this.getAllReleases()
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
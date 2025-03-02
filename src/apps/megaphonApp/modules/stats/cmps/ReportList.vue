<template>
  <div class="flex column gap10">
    <h2>{{$t('distributeLocales.reports')}}</h2>
    <ItemSearchList
      class="flex-1 height-all container report-list"
      :itemsData="allReleasesData"
      :initFilterBy="releaseFilterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
      :dontRoute="true"
      layoutMode="grid"
      :propsToPass="{
        inludeSearchInput: true,
        reportMode: true
      }"
    />
  </div>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';

import Tooltip from '../../../../common/modules/common/cmps/Tooltip.vue';

import ReleasePreview from '../../release/cmps/ReleasePreview.vue';
import ReleaseFilter from '../../release/cmps/ReleaseFilter.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';

export default {
  name: 'ReportList',
  data() {
    return {
      ReleasePreview,
      ReleaseFilter
    }
  },
  methods: {
    getAllReleases(filterBy) {
      const filterToSend = { releaseFilter: { releaseTypes: [], wasDistributed: true } }
      this.$store.dispatch({ type: 'release/loadItems', filterBy, orgFilter: filterToSend.releaseFilter, includeExpiredReleases: true, organizationId: this.organizationId });
    }
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    filterBy() {
      return this.$store.getters['stats/filterBy'];
    },
    isLoading() {
      return this.$store.getters['release/isLoading'] || this.$store.getters['organization/isLoading'];
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },

    
    allReleasesData() {
      return this.$store.getters['release/data'];
    },
    releaseFilterBy() {
      return this.$store.getters['release/filterBy'];
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
    }
  },
  watch: {
    organizationId() {
    },

    org: {
      deep: true,
      handler() {
        this.getAllReleases();
      }
    },
    releasePageInQuery(val, prev) {
      if (!val || !prev) return;
      const newFilter = JSON.parse(JSON.stringify(this.releaseFilterBy));
      if (!newFilter.filter) return;
      newFilter.filter.params.type = newFilter.filter.params.subType = '';
      this.$store.commit({ type: 'release/resetFilter' });
      this.getAllReleases(newFilter);
    },
    'releaseFilterBy': {
      deep: true,
      handler(val, prev) {
        if (!prev) return;
        if ((val?.filter?.params.type != prev?.filter?.params.type)) {
          const newFilter = JSON.parse(JSON.stringify(this.releaseFilterBy));
          if (!newFilter.filter) return;
          newFilter.filter.params.subType = '';
          this.getAllReleases(newFilter);
        }
        // this.$store.commit({ type: 'release/resetFilter' });
      }
    }
  },
  components: { Loader, FormInput, Tooltip, ReleasePreview, ReleaseFilter, ItemSearchList }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .report-list {
    padding: 0;
    .item-list {
      overflow-y: unset;
    }
  }
  hr {
    background-color: var(--clr-3);
    border: 1px solid var(--clr-3);
    height: 1px;
    width: 100%;
  }
}
</style>
<template>
  <section class="organization-page flex column width-all flex column">
    <!-- <h2>{{$t('release.releases')}}</h2> -->
    <ItemSearchList
      class="height-all table-like-list"
      :itemsData="allOrganizationData"
      :initFilterBy="filterBy"
      @filter="getAllROrganizations"
      itemDetailesPageName="OrganizationDetails"
      newItemPageName="OrganizationEdit"
      :singlePreviewCmp="OrganizationPreview"
      :filterByCmp="OrganizationFilter"
      :showActions="true"
      :dontRoute="true"
      :showLoader="false"
    >
      <div class="table-item-preview table-header">
        <h4>{{$t('organization.name')}}</h4>
      </div>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import OrganizationPreview from '../cmps/OrganizationPreview.vue';
import OrganizationFilter from '../cmps/OrganizationFilter.vue';

export default {
  name: 'OrganizationPage',
  data() {
    return {
      OrganizationPreview,
      OrganizationFilter
    }
  },
  methods: {
    getAllROrganizations(filterBy) {
      this.$store.dispatch({ type: 'organization/loadItems', filterBy, organizationId: this.$route.params.organizationId });
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    allOrganizationData() {
      return this.$store.getters['organization/data'];
    },
    filterBy() {
      return this.$store.getters['organization/filterBy'];
    },
    isLoading() {
      return this.$store.getters['organization/isLoading'];
    }
  },
  watch: {
    organizationId() {
      this.getAllROrganizations();
    }
  },
  components: { ItemSearchList, Loader, OrganizationPreview, OrganizationFilter }
}
</script>

<style lang="scss">
.megaphon-app {
  .organization-page {
    height: auto;

    // background-color: #E0E0E0;
  }
}
</style>
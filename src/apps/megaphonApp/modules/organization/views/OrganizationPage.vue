<template>
  <section class="organization-page flex column gap10 width-all">
    <h2>{{$t('organizationLocales.organizations')}}</h2>
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
      :isLoading="isLoading"
      :showLoader="false"
      layoutMode="flex"
    >
      <template v-slot:listHeader>
        <div class="table-item-preview table-header">
          <h4>{{$t('organizationLocales.name')}}</h4>
        </div>
      </template>>
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
@import '@/assets/styles/global/index';
.megaphon-app {
  .organization-page {
    padding: em(20px) 0;
    height: auto;

    // background-color: #E0E0E0;
  }
}
</style>
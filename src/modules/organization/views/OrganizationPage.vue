<template>
  <section class="organization-page height-all width-all flex column gap10">
    <h2>{{$t('organization.organizations')}}</h2>
    <ItemSearchList
      :itemsData="organizationData"
      :initFilterBy="filterBy"
      @filter="getOrganization"
      itemDetailesPageName="OrganizationDetails"
      newItemPageName="OrganizationEdit"
      :singlePreviewCmp="OrganizationPreview"
      :isLoading="isLoading"
      :showLoader="false"
      @remove="removeOrganization"
    />
    <!-- <Loader v-if="isLoading"/> -->
  </section>
</template>

<script>
import OrganizationPreview from '../cmps/OrganizationPreview.vue';
import ItemSearchList from '@/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'OrganizationPage',
  data() {
    return {
      OrganizationPreview
    }
  },
  methods: {
    getOrganization(filterBy) {
      this.$store.dispatch({ type: 'organization/loadOrganizations', filterBy });
    },
    removeOrganization(id) {
      this.$store.dispatch({type: 'organization/removeOrganization', id });
    },
  },
  computed: {
    organizationData() {
      return this.$store.getters['organization/data'];
    },
    filterBy() {
      return this.$store.getters['organization/filterBy'];
    },
    isLoading() {
      return this.$store.getters['organization/isLoading'];
    }
  },
  components: { OrganizationPreview, ItemSearchList, Loader }
}
</script>
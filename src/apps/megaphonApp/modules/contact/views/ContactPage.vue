<template>
  <section class="contact-page flex column width-all flex column">
    <!-- <h2>{{$t('release.releases')}}</h2> -->
    <ItemSearchList
      class="height-all table-like-list"
      :itemsData="allContactData"
      :initFilterBy="filterBy"
      @filter="getAllRContacts"
      itemDetailesPageName="ContactDetails"
      newItemPageName="ContactEdit"
      :singlePreviewCmp="ContactPreview"
      :filterByCmp="ContactFilter"
      :showActions="true"
      :dontRoute="true"
      :showLoader="false"
    >
      <div class="table-item-preview table-header">
        <p>{{$t('email')}}</p>
        <p>{{$t('contact.contactName')}}</p>
        <p>{{$t('contact.role')}}</p>
        <p>{{$t('contact.companyName')}}</p>
      </div>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import ContactPreview from '../cmps/ContactPreview.vue';
import ContactFilter from '../cmps/ContactFilter.vue';

export default {
  name: 'ContactPage',
  data() {
    return {
      ContactPreview,
      ContactFilter
    }
  },
  methods: {
    getAllRContacts(filterBy) {
      this.$store.dispatch({ type: 'contact/loadItems', filterBy, organizationId: this.$route.params.organizationId });
    },
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    allContactData() {
      return this.$store.getters['contact/data'];
    },
    filterBy() {
      return this.$store.getters['contact/filterBy'];
    },
    isLoading() {
      return this.$store.getters['contact/isLoading'];
    }
  },
  watch: {
    organizationId() {
      this.getAllRContacts();
    }
  },
  components: { ItemSearchList, Loader, ContactPreview, ContactFilter }
}
</script>

<style lang="scss">
.megaphon-app {
  .contact-page {
    padding: 10px;
    height: auto;

    background-color: #E0E0E0;
  }
}
</style>
<template>
  <section class="bug-page height-all width-all flex column gap10">
    <h2>{{$t('bug.bug')}}</h2>
    <ItemSearchList
      :itemsData="bugData"
      :initFilterBy="filterBy"
      @filter="getBugs"
      itemDetailesPageName="BugDetails"
      newItemPageName="BugEdit"
      :singlePreviewCmp="BugPreview"
      :isLoading="isLoading"
      :showLoader="false"
      @remove="removeBug"
    />
    <Loader v-if="isLoading" />
  </section>
</template>

<script>
import BugPreview from '../cmps/BugPreview.vue';
import ItemSearchList from '@/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'BugPage',
  data() {
    return {
      BugPreview
    }
  },
  methods: {
    getBugs(filterBy) {
      this.$store.dispatch({ type: 'bug/loadBugs', filterBy });
    },
    removeBug(id) {
      this.$store.dispatch({type: 'bug/removeBug', id });
    },
  },
  computed: {
    bugData() {
      return this.$store.getters['bug/data'];
    },
    filterBy() {
      return this.$store.getters['bug/filterBy'];
    },
    isLoading() {
      return this.$store.getters['bug/isLoading'];
    }
  },
  watch: {
    '$route.params.id'() {
      this.getBugs();
    }
  },
  components: { BugPreview, ItemSearchList, Loader }
}
</script>
<template>
  <section class="example-page flex column height-all width-all flex column">
    <h2>{{$t('examples')}}</h2>
    <ItemSearchList
      :itemsData="itemsData"
      :initFilterBy="filterBy"
      @filter="getItems"
      itemDetailesPageName="ExampleDetails"
      newItemPageName="ExampleEdit"
      :singlePreviewCmp="ExamplePreview"
    />
    <Loader v-if="isLoading"/>
  </section>
</template>

<script>
import ExamplePreview from '../cmps/ExamplePreview.vue';
import ItemSearchList from '@/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '../../common/cmps/Loader.vue';
export default {
  name: 'ExamplePage',
  data() {
    return {
      ExamplePreview
    }
  },
  methods: {
    getItems(filterBy) {
      this.$store.dispatch({ type: 'example/loadItems', filterBy });
    }
  },
  computed: {
    itemsData() {
      return this.$store.getters['example/itemsData'];
    },
    filterBy() {
      return this.$store.getters['example/filterBy'];
    },
    isLoading() {
      return this.$store.getters['example/isLoading'];
    }
  },
  components: { ExamplePreview, ItemSearchList, Loader }
}
</script>
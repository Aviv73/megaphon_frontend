<template>
  <ul class="item-chunk-loader-list flex column gap5">
    <li class="chunk-item-preview" v-for="item in items" :key="item._id">
      <component v-if="singlePreviewCmp" :is="singlePreviewCmp" :item="item"/>
      <div v-else>
        {{item}}
      </div>
    </li>

    <li v-if="isLoading">
      <Loader/>
    </li>
    <li v-else-if="isLoadable">
      <button class="btn" @click="loadChunk">{{$t('loadMore')}}</button>
    </li>
    <li v-else>
      {{$t('noMoreItems')}}
    </li>
  </ul>
</template>

<script>
import Loader from './Loader.vue'
export default {
  name: 'ItemChunkLoaderList',
  props: {
    singlePreviewCmp: [Object],
    loadItems: {
      required: true,
      type: Function
    },
    // filterBy: [Object],
    limit: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      isLoading: false,
      itemsData: null,
      page: 0
    }
  },
  computed: {
    items() {
      return this.itemsData?.items || [];
    },
    isLoadable() {
      return this.itemsData?.items?.length < this.itemsData?.total;
    }
  },
  methods: {
    async loadChunk() {
      this.isLoading = true;
      const pageData = { page: this.page, limit: this.limit };
      const data = await this.loadItems(pageData);
      if (!this.itemsData) this.itemsData = data;
      else this.itemsData.items.push(...data.items);
      this.page++;
      this.isLoading = false;
    }
  },
  created() {
    this.loadChunk();
  },
  components: { Loader },
}
</script>

<style>
.item-chunk-loader-list {

}
</style>
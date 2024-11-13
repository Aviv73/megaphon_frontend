<template>
  <div class="item-page flex align-center space-between gap15 column flex-1 height-all">
    <div class="width-all flex align-start space-between wrap gap50 filter-container">
      <component :is="filterByCmp || 'ItemFilter'" :initFilter="filterBy" @filtered="setFilter" v-bind="propsToPass"/>
      <router-link v-if="showActions && newItemPageName" :to="{name: newItemPageName, params: { organizationId: $route.params.organizationId } }"><button class="btn primary mid">{{$t('addNew')}}</button></router-link>
    </div>
    <div class="width-all flex column flex-1 gap30 item-list-container">
      <slot/>
      <ItemList
        :items="items"
        :layoutMode="layoutMode"
        v-if="!isLoading && items?.length"
        class="width-all"
        :singlePreviewCmp="singlePreviewCmp"
        :itemDetailesPageName="itemDetailesPageName"
        @edit="item => $emit('edit', item)"
        @remove="id => $emit('remove', id)"
        :propsToPass="propsToPass"
      />
      <div v-if="!isLoading && !items?.length" class="flex column space-between align-center no-results-preview">
        <h3>{{$t('noItemsFound')}}...</h3>
        <router-link v-if="showActions && newItemPageName && false" :to="{name: newItemPageName}">
          <button v-if="isFilterEmpty || true" class="btn big primary">{{$t('createNew')}}!</button>  
        </router-link>
      </div>
    </div>
    <PaginationBtns v-if="(filterBy && (totalItems > items.length) || true)" :total="totalItems" @filtered="setFilter" v-model="filterBy.pagination" :showAllPages="showAllPages" :btnsAsLinks="btnsAsLinks"/>
    <!-- <div v-else-if="!isLoading" class="flex column space-between align-center no-results-preview"> -->
    
    <Loader v-if="showLoader && isLoading"/>
  </div>
</template>

<script>
import ItemFilter from './ItemFilter.vue';
import ItemList from './ItemList.vue';
import PaginationBtns from './PaginationBtns.vue';
import Loader from '../Loader.vue';
import { setDeepVal, deepIterateWithObj } from '../../services/util.service';

import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

export default {
  name: 'ItemSearchList',
  components: { ItemFilter, ItemList, PaginationBtns, Loader },
  props: {
    initFilterBy: {
      type: Object,
      default: () => {}
    },
    itemsData: [Object],
    itemDetailesPageName: [String],
    newItemPageName: [String],
    singlePreviewCmp: [Object],
    filterByCmp: [Object],
    propsToPass: [Object],
    isLoading: [Boolean],
    isInnerRoute: [Boolean],
    showAllPages: [Boolean],
    btnsAsLinks: [Boolean],
    showLoader: {
      type: Boolean,
      default: true
    },
    dontRoute: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: true
    },
    dontEmitOnInit: {
      type: Boolean,
      default: false
    },
    layoutMode: [String],
  },
  data() {
    return {
      filterBy: null,
      dontEmit: false,
      // _initFilterItem: {},
    }
  },
  watch: {
    // initFilterBy: {
    //   deep: true,
    //   handler() {
    //     // this.dontEmit = true;
    //     // this.initFilter();
    //     // setTimeout(() => {
    //     //   this.dontEmit = false;
    //     // }, 1);
    //     // this.filterBy = JSON.parse(JSON.stringify(this.initFilterBy));
    //   }
    // },
    filterBy: {
      deep: true,
      handler(/* filterVal */) {
        if (this.dontEmit && this.dontEmitOnInit) return;
        if (!this.dontRoute) {
          // const query = {};
          // deepIterateWithObj(filterVal, (key, val) => {
          //   if (this.$route.query[key] != val) query[key] = val;
          // }, '_');
          // if (Object.keys(query).length) this.$router.push({ query: { ...this.$route.query, ...query} });
          this.setFilterOnQuery(this.filterBy);
        }
        this.$emit('filter', JSON.parse(JSON.stringify(this.filterBy)));
      }
    },
    '$route.query'() {
      // this._initFilterItem = basicStoreService.initFilterBy();
      this.initFilter(false);
    }
  },
  methods: {
    fillFilterBy(filterItem) {
      const basicFilterItem = basicStoreService.initFilterBy();
      for (let key in basicFilterItem) {
        if (!filterItem[key]) filterItem[key] = basicFilterItem[key];
      }
      return filterItem;
    },
    setFilterOnQuery(filterBy) {
      const query = {};
      deepIterateWithObj(filterBy, (key, val) => {
        if (this.$route.query[key] != val) query[key] = val;
      }, '_');
      if (Object.keys(query).length) this.$router.push({ query: { ...this.$route.query, ...query} });
    },
    setFilter(filter) {
      const newFilter = JSON.parse(JSON.stringify(filter));
      if (![newFilter?.filter?.search, this.filterBy?.filter?.search].includes(undefined)) {
        if (newFilter.filter.search !== this.filterBy.filter.search) newFilter.pagination.page = 0;
      }
      this.filterBy = newFilter;
    },
    initFilter(forceQuery = true) { // TODO:: IT SETS A NEW FILTER BY EVEN IF THERE IS A CHANGE ONLY IN A QUERY PARAM THAT IS NOT RELATED TO THE FILTER QUER PARAMS;
      const filterByToSet = this.fillFilterBy(JSON.parse(JSON.stringify(this.initFilterBy)));
      if (!this.dontRoute) {
        const queryParams = this.$route.query;
        for (let key in queryParams) {
          // if (!queryParams[key]) continue;
          let valToSet = queryParams[key]? +queryParams[key] : queryParams[key];
          if (isNaN(valToSet)) valToSet = queryParams[key]
          setDeepVal(filterByToSet, key, valToSet, '_');
        }
        deepIterateWithObj(filterByToSet, (key) => {
          let valToSet = +queryParams[key];
          if (isNaN(valToSet)) valToSet = queryParams[key]
          if (queryParams[key]) setDeepVal(filterByToSet, key, valToSet, '_');
        }, '_');
        if (forceQuery) this.setFilterOnQuery(filterByToSet);
      }
      // this.dontEmit = true;
      this.filterBy = filterByToSet;
      // setTimeout(() => {
      //   this.dontEmit = false;
      // }, 1);
    }
  },
  computed: {
    items() {
      if (this.isInnerRoute) {
        const startIdx = this.filterBy.pagination.limit * this.filterBy.pagination.page;
        const endIdx = startIdx + this.filterBy.pagination.limit;
        return this.itemsData.items.slice(startIdx, endIdx);
      }
      return this.itemsData.items;
    },
    totalItems() {
      return this.itemsData.total;
    },
    isFilterEmpty() {
      return false;
      // return JSON.stringify(this.filterBy) === JSON.stringify(basicStoreService.initFilterBy())
    }
  },
  created() {
    // this._initFilterItem = JSON.parse(JSON.stringify(this.initFilterBy));
    this.initFilter();
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme {
//   .item-preview {
//     // color: black; // black
//   }
// }
.item-page {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  // width: em(300px);
  width: 100%;
  .filter-container {
    padding: em(10px) 0;
  }
  .item-list {
    // flex: 1;
    overflow-y: auto;
    width: 100%;
    .item-preview {
      width: em(300px);
      max-width: 98%;
      height: em(200px);
      border-radius: em(5px);
      background-color: #fff;
      color: black; // black // var(--clr-0)
      input {
        color: black; // black // var(--clr-0)
      }
      box-shadow: $light-shadow;
      padding: em(20px);
      overflow-y: auto;
      overflow-x: hidden;

      @media (max-width: em(400px)) {
        width: 98%;
        // max-width: unset;
        // border-radius: 0;
      }
    }
  }

  .no-results-preview {
    // height: 35%;;
    // margin: 100px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .pagination-btns {
    margin-bottom: em(10px);
  }
}
</style>
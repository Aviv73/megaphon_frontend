<template>
  <div class="item-page flex align-center space-between gap15 column flex-1">
    <div class="width-all flex align-start space-between wrap gap50">
      <component :is="filterByCmp || 'ItemFilter'" :initFilter="filterBy" @filtered="setFilter"/>
      <router-link v-if="showActions && newItemPageName" :to="{name: newItemPageName, params: { organizationId: $route.params.organizationId } }"><button class="btn primary mid">{{$t('addNew')}}</button></router-link>
    </div>
    <div class="width-all flex column flex-1">
      <slot/>
      <ItemList
        v-if="!isLoading && items?.length"
        class="width-all" :items="items"
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
    <PaginationBtns v-if="filterBy && (totalItems > items.length)" :total="totalItems" :perPage="filterBy.pagination.limit" :initFilter="filterBy" @filtered="setFilter" v-model="filterBy.pagination.page"/>
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
    propsToPass: [Object]
  },
  data() {
    return {
      filterBy: null,
      dontEmit: false
    }
  },
  watch: {
    filterBy: {
      deep: true,
      handler(filterVal) {
        if (this.dontEmit && this.dontEmitOnInit) return;
        if (!this.dontRoute) {
          const query = {};
          deepIterateWithObj(filterVal, (key, val) => {
            if (this.$route.query[key] != val) query[key] = val;
          }, '_');
          if (Object.keys(query).length) this.$router.push({ query: { ...this.$route.query, ...query} });
        }
        this.$emit('filter', this.filterBy);
      }
    },
  },
  methods: {
    setFilter(filter) {
      const newFilter = JSON.parse(JSON.stringify(filter));
      if (![newFilter?.filter?.search, this.filterBy?.filter?.search].includes(undefined)) {
        if (newFilter.filter.search !== this.filterBy.filter.search) newFilter.pagination.page = 0;
      }
      this.filterBy = newFilter;
    },
    initFilter() {
      const filterByToSet = JSON.parse(JSON.stringify(this.initFilterBy));
      if (!this.dontRoute) {
        const queryParams = this.$route.query;
        deepIterateWithObj(filterByToSet, (key) => {
          let valToSet = +queryParams[key];
          if (isNaN(valToSet)) valToSet = queryParams[key]
          if (queryParams[key]) setDeepVal(filterByToSet, key, valToSet, '_');
        }, '_');
      }
      this.dontEmit = true;
      this.filterBy = filterByToSet;
      setTimeout(() => {
        this.dontEmit = false;
      }, 1);
    }
  },
  computed: {
    items() {
      return this.itemsData.items;
    },
    totalItems() {
      return this.itemsData.total;
    },
    isFilterEmpty() {
      return JSON.stringify(this.filterBy) === JSON.stringify(basicStoreService.initFilterBy())
    }
  },
  created() {
    this.initFilter();
  },
  components: { ItemFilter, ItemList, PaginationBtns, Loader }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.dark-theme {
  .item-preview {
    color: black;
  }
}
.item-page {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  // width: em(300px);
  width: 100%;
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
      color: black;
      input {
        color: black;
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
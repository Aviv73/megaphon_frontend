<template>
  <form @submit.prevent="emitFilter" class="release-filter width-all flex align-center space-between gap20">
    <div class="type-filter toggle-btns gap10">
      <FormInput @change="emitFilter" type="select" placeholder="select" :itemsMap="filterTypes" v-model="filterBy.filter.params['licenseType']" iconPos="left" />
      <!-- <button
        :class="{selected: !filterBy.filter.params.type}"
        @click.prevent.stop="setFilterType('')"
      >הכל</button>
      <button v-for="filterType in filterTypes" :key="filterType"
       :class="{selected: filterBy.filter.params.type === filterType}"
        @click.prevent.stop="setFilterType(filterType)"
      >{{$t(filterType)}}</button> -->
    </div>
    <div class="flex align-center gap20">
      <div class="sorters toggle-btns flex gap10">
        <button 
          :class="{selected: !filterBy.simpleSort}"
          @click.prevent.stop="setSortKey('')"
        ><img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/filter.svg')"/></button>
        <button 
          :class="{selected: filterBy.simpleSort === 'publishedAt'}"
          @click.prevent.stop="setSortKey('publishedAt')"
        >תאריך</button>
        <button
          :class="{selected: filterBy.simpleSort === 'title'}"
          @click.prevent.stop="setSortKey('title')"
        >א-ב</button>
      </div>
      <div class="serach flex align-center">
        <FormInput placeholder="search" v-model="filterBy.filter.search" iconPos="left">
          <button>
            <img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/search.svg')"/>
          </button>
        </FormInput>
      </div>
    </div>
    <!-- <button @click="emitFilter">{{$t('filter')}}</button> -->
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
export default {
  name: 'ReleaseFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterBy: null,
      filterTypes: { // licenseType
        all: undefined,
        'release.bought': '1',
        'release.original': '2',
      },
      // didInit: false
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', this.filterBy);
      this.didInit = true;
    },

    setFilterType(type) {
      this.filterBy.filter.params.type = type || undefined;
      this.emitFilter();
    },
    setSortKey(key) {
      // this.filterBy.sort = key ? { [key]: 1 } : {};
      this.filterBy.simpleSort = key;
      // for (let otherKey in this.filterBy.sort) this.filterBy.sort[otherKey] = 0;
      // if (key) this.filterBy.sort[key] = 1;
      this.emitFilter();
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter));
    // this.filterBy.filter.params.type = this.filterBy.filter.params.type || '';
  },
  // watch: {
  //   filterBy: {
  //     deep: true,
  //     handler() {
  //       this.emitFilter();
  //     } 
  //   }
  // },
  components: { FormInput }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.agam-app {
  .release-filter {
    .filter-icon-img {
      width: 15px;
      height: 15px;
    }
  
    .type-filter {
      box-shadow: unset;
      button {
        color: $light-white;
        background-color: $layout-black;
        border-inline-end: unset !important;
        border-radius: 12px;
        padding: 2px 10px;
        height: unset;
        &.selected {
          background-color: $layout-red;
        }
      }
    }
    .sorters {
      box-shadow: unset;
      button {
        background-color: unset;
        border-inline-end: unset !important;
        &.selected {
          background-color: unset;
          color: $layout-red
        }
      }
    }
  
    .serach {
      border-bottom: 1px solid $light-gray;
      input {
        border: 0;
        // border-radius: 0;
      }
    }
  }
}
</style>
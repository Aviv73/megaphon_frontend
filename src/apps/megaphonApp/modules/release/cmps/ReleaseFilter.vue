<template>
  <form @submit.prevent="emitFilter" class="release-filter width-all flex align-center space-between gap20">
    <FormInput @change="emitFilter" type="select" placeholder="type" :itemsMap="filterTypes" v-model="filterBy.filter.params['licenseType']" iconPos="left" />
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
      <FormInput class="search" placeholder="search" v-model="filterBy.filter.search" iconPos="left">
        <button>
          <img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/search.svg')"/>
        </button>
      </FormInput>
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
  computed: {
    org() {
      return this.$store.getters['organization/selectedItem'];
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
.megaphon-app {
  .release-filter {
    .filter-icon-img {
      width: em(15px);
      height: em(15px);
    }

    .toggle-btns {
      background: unset;
      box-shadow: unset;
      button{
        border-inline-end: 0 !important;
        background-color: unset !important;
      }
    }

    select {
      width: em(100px);
    }
  
    .search {
      overflow: unset;
      border-bottom: em(1px) solid $light-gray;
      input {
        border: 0;
        border: unset;
        
  // border-bottom: em(1px) solid gray;
  
        // border-radius: 0;
      }
    }
  }
}
</style>
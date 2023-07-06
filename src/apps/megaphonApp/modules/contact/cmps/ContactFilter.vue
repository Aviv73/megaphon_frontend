<template>
  <form @submit.prevent="emitFilter" class="release-filter flex-1 flex align-center space-between gap20">
    <div class="type-filter flex align-center gap10">
      <CompanyPicker v-model="companies"/>
      <TagPicker v-model="tags"/>
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
import CompanyPicker from '../../company/cmps/CompanyPicker.vue';
import TagPicker from '../../tag/cmps/TagPicker.vue';
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
      companies: [],
      tags: [],
      // didInit: false
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', {...this.filterBy, companies: this.companies.map(c => c._id), tags: this.tags.map(c => c._id)});
      this.didInit = true;
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
  watch: {
    companies: {
      deep: true,
      handler(val) {
        this.emitFilter();
      }
    },
    tags: {
      deep: true,
      handler(val) {
        this.emitFilter();
      }
    }
  },
  components: { FormInput, TagPicker, CompanyPicker }
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
<template>
  <form @submit.prevent="emitFilter" class="common-release-filter width-all flex align-center space-between gap20">
    <ToggleModal class="small-screen-item" :fullScreen="true">
      <template #toggler>
        <div class="btn">
          {{$t('filter')}}
        </div>
      </template>
      <template #content>
        <div class="flex column gap30">
          <ToggleBtns class="sorters flex gap10" :options="sortOpts" v-model="filterBy.simpleSort" @input="setSortKey" />
        </div>
      </template>
    </ToggleModal>
    <div class="serach flex align-center">
      <FormInput placeholder="search" v-model="filterBy.filter.search" iconPos="left"/>
      <button>
        <img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/search.svg')"/>
      </button>
    </div>
    <ToggleBtns class="wide-screen-item sorters flex gap10" :options="sortOpts" v-model="filterBy.simpleSort" @input="setSortKey" />
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import ToggleBtns from '../../common/cmps/ToggleBtns.vue';
import ToggleModal from '../../common/cmps/ToggleModal.vue';
export default {
  name: 'default_ReleaseFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterBy: null,
      sortOpts: [
        {img: require('@/apps/clientApps/agam/assets/images/filter.svg'), value: ''},
        {label: 'תאריך', value: 'publishedAt'},
        {label: 'א-ב', value: 'title'},
      ]
    }
  },
  computed: {
    showBookTypes() {
      return this.$route.query.page === 'book';
    },
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', this.filterBy);
    },

    setFilterType(type) {
      this.filterBy.filter.params.type = type;
      this.emitFilter();
    },
    setSortKey(key) {
      // this.filterBy.sort = key ? { [key]: 1 } : {};
      this.filterBy.simpleSort = key
      // for (let otherKey in this.filterBy.sort) this.filterBy.sort[otherKey] = 0;
      // if (key) this.filterBy.sort[key] = 1;
      this.emitFilter();
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter));
    this.filterBy.filter.params.type = this.filterBy.filter.params.type || '';
  },
  // watch: {
  //   filterBy: {
  //     deep: true,
  //     handler() {
  //       this.emitFilter();
  //     } 
  //   }
  // },
  components: { FormInput, ToggleBtns, ToggleModal }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .defaultApp {
  .common-release-filter {
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
          // color: $layout-red
        }
        img {
          width: 15px;
          height: 15px;
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
// }
</style>
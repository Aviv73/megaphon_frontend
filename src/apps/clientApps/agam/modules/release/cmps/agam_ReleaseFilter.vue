<template>
  <form @submit.prevent="emitFilter" class="release-filter width-all flex align-center space-between gap20">
    <ToggleBtns v-if="showBookTypes" class="wide-screen-item type-filter gap10" :options="filterTypes" v-model="filterBy.filter.params.type" @input="setFilterType" />
    <ToggleModal class="small-screen-item" :fullScreen="true">
      <template #toggler>
        <div class="btn">
          {{$t('filter')}}
        </div>
      </template>
      <template #content>
        <div class="flex column gap30">
          <ToggleBtns class="sorters flex gap10" :options="sortOpts" v-model="filterBy.simpleSort" @input="setSortKey" />
          <ToggleBtns v-if="showBookTypes" class="type-filter gap10" :options="filterTypes" v-model="filterBy.filter.params.type" @input="setFilterType" />
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
import ToggleBtns from '../../../../../common/modules/common/cmps/ToggleBtns.vue';
import ToggleModal from '../../../../../common/modules/common/cmps/ToggleModal.vue';
export default {
  name: 'agam_ReleaseFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      filterBy: null,
      filterTypes: [
        {label: 'הכל', value: ''},
        'ספרי ילדים',
        'ספרי נוער',
        'ספרי עיון, פנאי וסיפרות',
        // {label: 'ספרי עיון, פנאי וסיפרות', value: 'ספרי עיון ופנאי'}
        // {label: 'סיפרי עיון, פנאי וסיפרות', value: ['ספרי עיון ופנאי', 'סיפרות', 'ספרי עיון, פנאי וסיפרות']}
        // 'ספרי עיון ופנאי',
        // 'סיפרות'
      ],
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
}
</style>
<template>
  <form @submit.prevent="emitFilter" class="release-filter width-all flex align-center space-between gap20">
    <FormInput @change="emitFilter" type="select" placeholder="type" :itemsMap="filterTypes" v-model="filterBy.filter.params['licenseType']" />
    <FormInput @change="setDateRange" type="select" placeholder="release.filterByYear" :items="yearsOpts" v-model="dateSelectVal" />
    <FormInput v-if="selectedReleaseIds.length" @change="addToFolder" type="select" placeholder="release.addToFolder" :items="foldersOpts" v-model="folderVal" />
    <div class="flex align-center gap20">
      <ToggleBtns class="sorters flex gap10" :options="[
        {img: require('@/apps/megaphonApp/assets/images/sort.svg'), value: ''},
        {label: 'תאריך', value: 'publishedAt'},
        {label: 'א-ב', value: 'title'},
      ]" v-model="filterBy.simpleSort" @input="setSortKey" />
          
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
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import ToggleBtns from '../../../../common/modules/common/cmps/ToggleBtns.vue';
export default {
  name: 'ReleaseFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    },
    selectedReleaseIds: {
      type: Array,
      default: () => []
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
      folderVal: '',
      dateSelectVal: '',
    }
  },
  computed: {
    org() {
      return this.$store.getters['organization/selectedItem'];
    },

    yearsOpts() {
      return [2017, 2018, 2019, 2020, 2021, 2022, 2023, {value: undefined, label: 'clear'}].reverse();
    },

    foldersOpts() {
      function parseFolders(folderItem = {name: '', children: []}, parsedFolders = [/* {label: 'release.outOfFolders', value: {folderPath: null, folder: null}} */], parentPath = '') {
        if (Array.isArray(folderItem)) {
          folderItem.forEach(c => parseFolders(c, parsedFolders, parentPath));
        } else {
          if (!folderItem?.name) return parsedFolders;
          const relPath = [parentPath, folderItem.name].filter(Boolean).join('/');
          parsedFolders.push({label: relPath, value: {folderPath: relPath, folder: folderItem}});
          folderItem.children.forEach(c => {
            parseFolders(c, parsedFolders, relPath);
          });
        }
        return parsedFolders;
      }
      return parseFolders(this.org?.folders) || []
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
    },

    setDateRange(val) {
      if (!val) {
        this.filterBy.dateRange = undefined;
        this.dateSelectVal = '';
      }
      else {
        const yearTime = new Date(val, 0, 1, 0, 0, 0, 0);
        const dateRange = {
          from: yearTime.getTime(),
          to: yearTime.setFullYear(val+1)
        }
        this.filterBy.dateRange = dateRange;
      }
      this.emitFilter();
    },

    addToFolder(val) {
      console.log('AddingToFolder', val);
      evManager.emit('folder-updated', this.org._id, val.folderPath, val.folder);
      this.folderVal = '';
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
  components: { FormInput, ToggleBtns }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app.dark-theme {
  .release-filter, .toggle-btns button {
    color: #cdcdcd;
  }

}
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
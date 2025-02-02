<template>
  <form @submit.prevent="emitFilter" class="release-filter width-all flex align-center space-between gap20 wrap">
    <!-- <FormInput @change="emitFilter" type="select" placeholder="type" :itemsMap="filterTypes" v-model="filterBy.filter.params['licenseType']" /> -->
    
    <FormInput class="search" placeholder="search" v-model="filterBy.filter.search" iconPos="left" v-if="!isScreenWide">
      <button>
        <div v-html="searchImg" class="filter-icon-img svg-parrent"></div>
        <!-- <img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/search.svg')"/> -->
      </button>
    </FormInput>
    <div class="ph" v-else></div>
    <ToggleModalOnlyForSmallScreen>
      <template #toggler>
        <div class="btn">
          {{$t('filter')}}
        </div>
      </template>
      <div class="filter-items flex-1 flex align-center_ space-between gap15 wrap" :class="{column: !isScreenWide}">
        <template v-if="org && org.innerFilters && org.innerFilters.length">
          <FormInput
            v-for="(currFilterItem, idx) in org.innerFilters" :key="idx"
            type="select"
            :placeholder="currFilterItem.title"
            :items="currFilterItem.options.map(c => ({label: c.label, value: (c.value === ''? undefined : c.value)}))"
            v-model="filterBy.filter.params[currFilterItem.field]"
            @change="emitFilter"
          />
        </template>
        <!-- <button @click="setSortKey('')">
          <div v-html="svgs.icons.sort" class="svg-parrent sort-svg"></div>
        </button> -->
        <FormInput class="width-content" @change="setDateRange" type="select" placeholder="releaseLocales.allYears" :items="yearsOpts" v-model="dateSelectVal" />
        <ToggleBtns class="sorters flex gap10" :options="[
          /*{img: require('@/apps/megaphonApp/assets/images/sort.svg'), value: ''},*/
          {html: `<div title='${$t('clear')}' class='svg-parrent sort-svg'>${svgs.icons.sort}</div>`, value: ''},
          {label: 'תאריך', value: 'publishedAt'},
          {label: 'א-ב', value: 'title'},
        ]" v-model="filterBy.simpleSort" @input="setSortKey" />
        <!-- <div class="flex align-center gap20">
              
        </div> -->
        <FormInput v-if="selectedReleaseIds.length && isRoleInOrg('producer')" @change="addToFolder" type="select" placeholder="releaseLocales.addToFolder" :items="foldersOpts" v-model="folderVal" />
      </div>
    </ToggleModalOnlyForSmallScreen>
    <!-- <button @click="emitFilter">{{$t('filter')}}</button> -->
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import ToggleBtns from '../../../../common/modules/common/cmps/ToggleBtns.vue';
import { organizationService } from '../../organization/services/organization.service';
import ToggleModalOnlyForSmallScreen from '../../../../common/modules/common/cmps/ToggleModalOnlyForSmallScreen.vue';

import  { getSvgs as getGlobalSvgs } from '@/assets/images/svgs.js';
import  { getSvgs } from '@/apps/megaphonApp/assets/images/svgs.js';
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
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },

    org() {
      return this.$store.getters['organization/selectedItem'];
    },
    
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },

    yearsOpts() {
      // return [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, {value: undefined, label: 'clear'}].reverse();
      return [
        {value: undefined, label: 'releaseLocales.allYears'},
        ...(() => {
          const nowYear = new Date().getFullYear();
          const years = [];
          for (let year = nowYear; year >= 2017; year--) years.push(year);
          return years;
        })()
      ]
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
    },

    
    searchImg() {
      return getGlobalSvgs('var(--clr-0)').search;
    },
    svgs() {
      return getSvgs('var(--clr-0)');
    }
  },
  methods: {
    isRoleInOrg(role) {
      return organizationService.isUserRoleInOrg(this.org?._id, role, this.loggedUser);
    },
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
      evManager.emit('folder-updated', this.org._id, val.folderPath, val.folder);
      this.folderVal = '';
    },
    onSearch(searchTerm) {
      this.filterBy.filter.search = searchTerm;
      this.emitFilter();
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter));
    evManager.on('searchReleases', this.onSearch);
    // this.filterBy.filter.params.type = this.filterBy.filter.params.type || '';
  },
  destroyed() {
    evManager.off('searchReleases', this.onSearch);
  },
  // watch: {
  //   filterBy: {
  //     deep: true,
  //     handler() {
  //       this.emitFilter();
  //     } 
  //   }
  // },
  components: { FormInput, ToggleBtns, ToggleModalOnlyForSmallScreen }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.dark-theme.megaphon-app {
  .release-filter, .toggle-btns button {
    color: #cdcdcd;
  }

}
.megaphon-app {
  .release-filter {
    .filter-items {
      >* {
        &:not(:last-child) {
          @media (min-width: $small-screen-break) {
            border-inline-end: 1px solid var(--clr-0);
            padding-inline-end: em(12.5px);
          }
        }
      }
    }
    .form-input-select {
      min-width: unset;
      .input {
        .select {
          .head {
            background-color: unset !important;
          }
        }
      }
      .actual-input {
        border: 0;
      }
      .head {
        padding: 0;
      }
      .selected-preview {
        padding-inline-end: 0;
      }
    }
    

    .sort-svg {
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
      .filter-icon-img {
        width: em(15px);
        height: em(15px);
      }
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
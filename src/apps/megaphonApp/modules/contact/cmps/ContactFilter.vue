<template>
  <ToggleModalOnlyForSmallScreen>
    <template #toggler>
      <div class="btn">
        {{$t('filter')}}
      </div>
    </template>
    <form @submit.prevent="emitFilter" class="contact-filter flex-1 flex align-start space-between gap20">
      <div class="pickers flex align-start gap10 flex-1">
        <CompanyPicker class="flex-1" v-model="companies" :onlyRelevants="false" :organizationId="organizationId"/>
        <TagPicker class="flex-1" v-model="tags" :onlyRelevants="false" :organizationId="organizationId"/>
      </div>
      <div class="flex align-center gap20">
        <div class="serach flex align-start">
          <FormInput placeholder="search" v-model="filterBy.filter.search" iconPos="left">
            <button>
              <img class="filter-icon-img" :src="require('@/apps/clientApps/agam/assets/images/search.svg')"/>
            </button>
          </FormInput>
        </div>
      </div>
      <!-- <button @click="emitFilter">{{$t('filter')}}</button> -->
    </form>
  </ToggleModalOnlyForSmallScreen>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import CompanyPicker from '../../company/cmps/CompanyPicker.vue';
import TagPicker from '../../tag/cmps/TagPicker.vue';
import ToggleModalOnlyForSmallScreen from '../../../../common/modules/common/cmps/ToggleModalOnlyForSmallScreen.vue';
export default {
  name: 'ContactFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    },
    organizationId: {
      type: String,
      required: false
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
  computed: {
    // organizationId() {
    //   return this.$route.params.organizationId;
    // }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', {...this.filterBy, companies: this.companies, tags: this.tags});
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
  components: { FormInput, TagPicker, CompanyPicker, ToggleModalOnlyForSmallScreen }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .contact-filter {
    
    @media (max-width: $small-screen-breake) {
      flex-direction: column;
      align-items: center;
      .pickers {
        flex-direction: column;
      }
    }

    .filter-icon-img {
      width: em(15px);
      height: em(15px);
    }

    $item-height: em(30px);
    .form-input {
      min-height: $item-height;
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
      border-bottom: em(1px) solid $light-gray;
      width: em(180px);
      input {
        border: 0;
        // border-radius: 0;
      }
    }
  }
}
</style>
<template>
  <form @submit.prevent="emitFilter" class="item-filter">
    <div class="flex align-center gap5">
      <FormInput placeholder="search" v-model="filterBy.filter.search"/>
      <button class="btn" @click="emitFilter">{{$t('search')}}</button>
    </div>
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
export default {
  name: 'ItemFilter',
  props: {
    initFilter: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitFilter() {
      this.$emit('filtered', this.filterBy);
    }
  },
  data() {
    return {
      filterBy: null
    }
  },
  created() {
    this.filterBy = JSON.parse(JSON.stringify(this.initFilter));
  },
  components: { FormInput }
}
</script>
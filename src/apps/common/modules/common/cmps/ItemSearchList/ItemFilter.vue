<template>
  <form @submit.prevent="emitFilter" class="item-filter">
    <FormInput placeholder="search" v-model="filterBy.filter.search"/>
    <!-- <button @click="emitFilter">{{$t('filter')}}</button> -->
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
<template>
  <form @submit.prevent="emitFilter" class="example-filter">
    <FormInput v-model="filterBy.search"/>
    <!-- <button @click="emitFilter">{{$t('filter')}}</button> -->
  </form>
</template>

<script>
import FormInput from '@/modules/common/cmps/FormInput.vue';
export default {
  name: 'ExampleFilter',
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
    this.filterBy = {...this.initFilter};
  },
  components: { FormInput }
}
</script>
<template>
  <FormInput :value="value" @input="val => $emit('input', val)" :type="isMultiSelect ? 'multiselect' : 'select'" :items="selectItems" :showVals="true" :placeholder="placeholder"/>
</template>

<script>
import { getDeepVal } from '../services/util.service';
import FormInput from './FormInput.vue'
export default {
  name: "DbSelect",
  components: { FormInput },
  props: {
    value: null,
    group: String,
    placeholder: String,
    isMultiSelect: Boolean,
    imgProp: String
  },
  data() {
    return {
      selectItems: []
    }
  },
  async created() {
    this.selectItems = (await this.$store.dispatch({ type: 'selectItem/loadItems', dontSet: true, filterBy: { filter: { params: { group: this.group } } } })).items.map(c => ({
      label: c.label,
      value: c._id,
      img: this.imgProp ? getDeepVal(c, this.imgProp) : undefined
    }));
    if (this.imgProp) console.log(this.selectItems);
  }
}
</script>

<style>

</style>
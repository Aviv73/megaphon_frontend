<template>
  <div class="multiple-file-picker flex column flex-start gap10">
    <div v-for="(currVal, idx) in value" :key="idx" class="flex align-center gap10">
      <FileUploader
        :value="currVal"
        :viewAsImg="viewAsImg"
        :exept="exept"
        @input="val => updateValue(val, idx)"
      />
      <button v-if="!isSingleItem" @click="$emit('input', spliceFromVal(value, idx))"><img class="delete-mini-btn" :src="require('@/apps/megaphonApp/assets/images/delete_red.svg')"/></button>
    </div>
    <button v-if="!isSingleItem" class="btn big width-content" @click="$emit('input', [...(value || []), createNewItem(value)])">{{$t('add')}}</button>
  </div>
</template>

<script>
import FileUploader from '../../../../common/modules/common/cmps/file/FileUploader.vue';
export default {
  name: 'MultipleFilePicker',
  props: {
    value: [Array],
    isSingleItem: {
      type: Boolean,
      default: false
    },
    exept: [String],
    viewAsImg: [Boolean],
    dataField: [Object]
  },
  methods: {
    spliceFromVal(val, idx) {
      val = [...val];
      val.splice(idx, 1);
      return val;
    },
    updateValue(val, idx) {
      const newValue = [...this.value];
      newValue[idx] = val;
      this.$emit('input', newValue);
    },
    createNewItem() {
      return {title: '', src: ''};
    },
  },
  created() {
    if (!this.value?.length) this.$emit('input', [this.createNewItem()]);
  },
  components: {
    FileUploader
  },
}
</script>

<style>

</style>
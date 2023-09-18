<template>
  <div class="multiple-file-picker flex column flex-start gap10">
    <div v-for="(currVal, idx) in value" :key="idx" class="flex align-start gap20">
      <FileUploader
        :value="currVal"
        :viewAsImg="viewAsImg"
        :accept="accept"
        @input="val => updateValue(val, idx)"
      />
      <!-- <FormInput v-model="currVal.title"/> -->
      <TableActionBtns v-if="!isSingleItem" :value="value" @input="updateFromActions" :idx="idx"/>
    </div>
    <button v-if="!isSingleItem" class="btn big primary width-content" @click="$emit('input', [...(value || []), createNewItem(value)])">{{$t('add')}}</button>
  </div>
</template>

<script>
import FileUploader from '../../../../../common/modules/common/cmps/file/FileUploader.vue';
import FormInput from '../../../../../common/modules/common/cmps/FormInput.vue';
import TableActionBtns from '../../../../../common/modules/common/cmps/TableActionBtns.vue';
export default {
  name: 'MultipleFilePicker',
  props: {
    value: [Array],
    isSingleItem: {
      type: Boolean,
      default: false
    },
    accept: [String],
    viewAsImg: [Boolean],
    dataField: [Object]
  },
  methods: {
    updateValue(val, idx) {
      const newValue = [...this.value];
      newValue[idx] = val;
      this.$emit('input', newValue);
    },
    createNewItem() {
      return {title: '', src: ''};
    },
    updateFromActions(val) {
      this.$emit('input', val);
    }
  },
  created() {
    if (!this.value?.length) this.$emit('input', [this.createNewItem()]);
  },
  components: {
    FileUploader,
    TableActionBtns,
    FormInput
  },
}
</script>

<style>

</style>
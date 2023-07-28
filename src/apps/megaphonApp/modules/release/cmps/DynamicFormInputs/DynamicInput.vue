<template>
  <div class="dynamic-input flex gap30" v-if="dataField" :class="`input-field-${dataField.type}`">
    <h3 v-if="!noTitle && ((dataField.title && (dataField.type === 'SEPARATOR') || (dataField.type !== 'SEPARATOR')))">{{dataField.title}}</h3>
    <div class="flex-1">
      <p v-if="cmpName === 'UNKNOWN'">UNKNOWN INPUT TYPE "{{dataField.type}}"</p>
      <component
        v-else
        class="flex-1"
        :is="cmpName" 
        ref="input"
        v-bind="propsToPass" 
        :value="value"
        :dataField="dataField"
        @change="val => $emit('input', basePath, val)"
        @input="val => $emit('input', basePath, val)"
      />
      <div v-if="dataField.type === 'ROW'" class="flex gap10 row-container">
        <DynamicInput
          v-for="field in dataField.fields"
          :key="field.fieldName"
          :dataField="field"
          :basePath="field.fieldName"
          :organization="organization"
          :parentItem="parentItem"
          :value="getVal(parentItem, field.fieldName)"
          @input="(path, val) => $emit('input', path, val)"
        />
      </div>
      <div v-if="dataField.type === 'TABLE'" class="flex column gap10 width-content">
        <div class="flex align-center gap10">
          <p class="flex-1" v-for="(field, idx) in dataField.fields" :key="`${basePath}.${idx}.${field.title}`">
            {{field.title}}
          </p>
          <p class="flex-1"></p>
        </div>
        <div v-for="(currVal, idx) in value" :key="idx" class="flex align-center gap10">
          <DynamicInput
            class="flex-1"
            v-for="field in dataField.fields"
            :key="`${basePath}.${idx}.${field.fieldName}`"
            :dataField="field"
            :basePath="`${basePath}.${idx}.${field.fieldName}`"
            :value="getVal(currVal, field.fieldName) || []"
            @input="(path, val) => $emit('input', path, val)"
            :noTitle="true"
          />
          <TableActionBtns v-model="value" :idx="idx"/>
        </div>
        <button class="btn big width-content align-self-end" @click.prevent="$emit('input', basePath, [...(value || []), createNewItem(dataField.fields)])">{{$t('add')}}</button>
      </div>
    </div>
    <p v-if="dataField.helpText">{{dataField.helpText}}</p>
    <!-- <div v-if="dataField.fields">
    </div> -->
  </div>
</template>

<script>
import { getDeepVal, setDeepVal } from '@/apps/common/modules/common/services/util.service';
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
// import FileInput from '@/apps/common/modules/common/cmps/FileInput.vue';
import { VueEditor } from "vue2-editor";
import { createItemForDynamicForm } from '../../../common/services/CreateItemForDynamicForm';
import ReleasePicker from './ReleasePicker.vue';
import ReleaseIdsPicker from './ReleaseIdsPicker.vue';
import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import MultipleFilePicker from './MultipleFilePicker.vue';
import TableActionBtns from '../../../../../common/modules/common/cmps/TableActionBtns.vue';



export default {
  name: 'DynamicInput',
  props: {
    dataField: [Object],
    value: [Object, String, Array, Number, Boolean],
    basePath: [String],
    parentItem: [Object],
    noTitle: [Boolean],
    organization: [Object]
  },
  data() {
    return {
      propsToPass: {},
      cmpName: ''
    }
  },
  methods: {
    initCmpData() {
      let type = this.dataField.type || '';
      type = type.toUpperCase();
      if (['EMAIL', 'URL', 'VIDEOURL'].includes(type)) type = 'TEXT';
      switch (type) {
        case 'TEXT':
        case 'DATE':
        case 'NUMBER':
          this.propsToPass = { type: type.toLowerCase(), placeholder: this.dataField.title };
          this.cmpName = 'FormInput';
          break;
        case 'SELECTION':
          this.propsToPass = { type: 'select', items: this.dataField.options || [] };
          this.cmpName = 'FormInput';
          break;
        case 'SEPARATOR':
        case 'SEPARATOR_BOLD':
          this.cmpName = 'hr';
          if (type === 'SEPARATOR_BOLD') this.propsToPass = { style: 'border-width:3px' };
          break;
        case 'LONGRICHTEXT':
        // case 'RICHTEXT':
          // this.propsToPass = { width: 400 };
          // this.propsToPass = { style: 'direction: ltr' };
          setTimeout(() => {
            try {
              this.$refs.input.quill.format('align', 'right');
            } catch(e) {}
          }, 10);
          this.cmpName = 'VueEditor';
          break;
        case 'TABLE':
        case 'ROW':
          this.propsToPass = { hidden: true };
          this.cmpName = 'div';
          break;
        case 'RELEASES_SELECTOR': 
          this.cmpName = 'ReleasePicker'
          this.propsToPass = { organization: this.organization };
          break;
        case 'FILE':
        case 'VIDEO':
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { isSingleItem: true, accept: this.dataField.filter };
          break;
        case 'IMAGE':
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { viewAsImg: true, isSingleItem: true, exept: '' };
          break;
        case 'IMAGEGALLERY':
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { viewAsImg: true, isSingleItem: false, exept: '' };
          break;

        case 'SELECT_RELEASES':
          this.cmpName = 'ReleaseIdsPicker';
          this.propsToPass = { releases: this.parentItem[this.dataField.fromField] };
          break;
        //   break;
        // case 'CORPABLE_IMAGE':
        //   break;
        // case 'SELECTIONWITHIMAGE':
        //   break;
        // case 'LOGOSELECTION':
        //   break;


        default: 
          this.cmpName = 'UNKNOWN';
          break;

        
      }
      if (this.dataField.props) this.propsToPass = { ...this.propsToPass, ...this.dataField.props };
    },
    getVal(item, fieldPath) {
      return getDeepVal(item, fieldPath);
    },

    createNewItem(dataFields) {
      return createItemForDynamicForm(dataFields);
    },
  },
  mounted() {
    this.initCmpData();
  },
  components: { 
    FormInput,
    VueEditor,
    ReleasePicker,
    ReleaseIdsPicker,
    FileUploader,
    MultipleFilePicker,
    TableActionBtns
    // FileInput
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.dynamic-input {
  .row-container {
    .dynamic-input {
      flex-direction: column !important;
      gap: rem(5px);
    }
  }
}
</style>
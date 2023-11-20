<template>
  <div class="dynamic-input flex gap30" v-if="dataFieldToRender" :class="`input-field-${dataFieldToRender.type}`">
    <h3 v-if="!noTitle && ((dataFieldToRender.title && (dataFieldToRender.type === 'SEPARATOR') || (dataFieldToRender.type !== 'SEPARATOR')))">{{dataFieldToRender.title}}</h3>
    <div class="flex-1">
      <p v-if="cmpName === 'UNKNOWN'">UNKNOWN INPUT TYPE "{{dataFieldToRender.type}}"</p>
      <component
        v-else
        class="flex-1"
        :is="cmpName" 
        ref="input"
        v-bind="propsToPass" 
        :value="value"
        :dataField="dataFieldToRender"
        :organization="organization"
        :parentItem="parentItem"
        @change="val => $emit('input', val, basePath)"
        @input="val => $emit('input', val, basePath)"
      />
      <div v-if="dataFieldToRender.type === 'ROW'" class="flex gap10 row-container">
        <DynamicInput
          v-for="field in dataFieldToRender.fields"
          :key="field.fieldName"
          :dataField="field"
          :basePath="field.fieldName"
          :organization="organization"
          :parentItem="parentItem"
          :value="getVal(parentItem, field.fieldName)"
          @input="(val, path) => $emit('input', val, path)"
        />
      </div>
      <table v-if="dataFieldToRender.type === 'TABLE'" colspacing="5px" class="flexx column gap10 width-content">
        <tr class="flexx align-center gap10" v-if="value && value.length">
          <td v-for="(field, idx) in dataFieldToRender.fields" :key="`${basePath}.${idx}.${field.title}`">
            <p class="flex-1">
              {{field.title}}
            </p>
          </td>
          <td class="flex-1"></td>
        </tr>
        <tr v-for="(currVal, idx) in value" :key="idx" class="flexx align-center gap10">
          <td
            v-for="field in dataFieldToRender.fields.filter(c => !c.hidden)"
            :key="`${basePath}.${idx}.${field.fieldName}`"
          >
            <DynamicInput
              class="flex-1"
              :dataField="field"
              :basePath="`${basePath}.${idx}.${field.fieldName}`"
              :value="getVal(currVal, field.fieldName) || ''"
              :organization="organization"
              :parentItem="parentItem"
              @input="(val, path) => $emit('input', val, path || `${basePath}.${idx}.${field.fieldName}`)"
              :noTitle="true"
            />
          </td>
          <td>
            <TableActionBtns :allowEmptyArray="true" class="flex-1" :value="value" @input="val => $emit('input', val, basePath)" :idx="idx"/>
          </td>
        </tr>
        <tr>
          <td>
            <button class="btn big width-content align-self-end" @click.prevent="$emit('input', [...(value || []), createNewItem(dataFieldToRender.fields)], basePath)">{{$t('add')}}</button>
          </td>
        </tr>
      </table>
    </div>
    <p v-if="dataFieldToRender.helpText">{{dataFieldToRender.helpText}}</p>
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
import ImageCrop from './ImageCrop.vue';
import TableActionBtns from '../../../../../common/modules/common/cmps/TableActionBtns.vue';
import { range } from '../../../../../common/modules/common/services/util.service';


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
      cmpName: '',
      dataFieldToRender: this.dataField
    }
  },
  methods: {
    initCmpData() {
      let type = this.dataField.type || '';
      type = type.toUpperCase();
      if (['EMAIL', 'URL', 'VIDEOURL'].includes(type)) type = 'TEXT';
      if (type === 'IMAGEGALLERY') {
        type = 'TABLE';
        this.dataFieldToRender = {
          ...this.dataField,
          type: 'TABLE',
          fields: [
            // {
            //   type: 'TEXT',
            //   fieldName: 'src',
            //   hidden: true
            // },
            {
              title: this.$t('photo'),
              type: 'IMAGE_SRC',
              fieldName: 'src',
            },
            {
              title: this.$t('title'),
              type: 'TEXT',
              fieldName: 'title',
            },
            {
              title: this.$t('credit'),
              type: 'TEXT',
              fieldName: 'credit',
            },
          ]
        }
      }
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
        case 'RICHTEXT':
          // this.propsToPass = { width: 400 };
          // this.propsToPass = { style: 'direction: ltr' };
          setTimeout(() => {
            try {
              this.$refs.input.quill.format('align', 'right');
              window.scroll(0, 0);
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
        case 'IMAGE_SRC':
          // this.cmpName = 'FileUploader';
          this.cmpName = 'ImageCrop';
          this.propsToPass = { viewAsImg: true, accept: this.dataField.filter, onlySrc: true };
          break;
        case 'IMAGE':
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { viewAsImg: true, isSingleItem: true, accept: this.dataField.filter };
          break;
        case 'IMAGEGALLERY':
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { viewAsImg: true, isSingleItem: false, accept: this.dataField.filter };
          break;
        case 'SELECT_RELEASES': // change to something like: SELECT_RELEASES_FROM_INNER_PARAM
          this.cmpName = 'ReleaseIdsPicker';
          this.propsToPass = { releases: this.parentItem[this.dataField.fromField], fromField: this.dataField.fromField };
          break;
        case 'CORPABLE_IMAGE':
          // this.cmpName = 'ImageCrop';
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { viewAsImg: true, isSingleItem: true, accept: this.dataField.filter };
          break;
        case 'LOGOSELECTION':
          this.cmpName = 'FormInput';
          this.propsToPass = { type: 'select', items: this.organization?.logos?.map(c => ({value: c.url, img: c.url, label: c.title})) || [] };
          break;
        case 'SELECTIONWITHIMAGE': // change to somethong like: IMG_SELECTION_FOR_VIDEO_LINK
          this.cmpName = 'FormInput';
          const getYoutubeVideoThumb = (url, index = 0) => { // from old developer's code:
            if (!url) return '';
            const results = url.match('[\\?&]v=([^&#]*)');
            const video = results === null ? url : results[1];
            return `http://img.youtube.com/vi/${video}/maxres${index}.jpg`;
          };
          const videoUrl = getDeepVal(this.parentItem, this.basePath.replace(this.dataField.fieldName, this.dataField.linkedVideoField));
          this.propsToPass = { 
            type: 'select', 
            items: range(4).map((_, idx) => {
              const currUrl = getYoutubeVideoThumb(videoUrl, idx)
              return {value: currUrl, img: currUrl, label: `${this.$t('photo')} ${idx+1}`};
            })
          };
          break;

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
    TableActionBtns,
    ImageCrop
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
  table {
    // border-spacing: em(10px);
    td {
      padding: em(5px);
      vertical-align: top;
    }
  }
}
</style>
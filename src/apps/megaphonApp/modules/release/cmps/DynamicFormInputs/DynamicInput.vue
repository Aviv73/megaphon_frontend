<template>
  <div class="dynamic-input flex gap30" v-if="dataFieldToRender" :class="`input-field-${dataFieldToRender.type}`">
    <h3 class="ignore-theme-style" v-if="!noTitle && ((dataFieldToRender.title && (dataFieldToRender.type === 'SEPARATOR') || (dataFieldToRender.type !== 'SEPARATOR')))">{{dataFieldToRender.title}}</h3>
    <div class="flex-1 input-container" :class="{'table-container': dataFieldToRender.type === 'TABLE'}">
      <p v-if="cmpName === 'UNKNOWN'">UNKNOWN INPUT TYPE "{{dataFieldToRender.type}}"</p>
      <component
        v-else
        class="flex-1 dynamic-section"
        :is="cmpName" 
        ref="input"
        v-bind="propsToPass" 
        :value="value"
        :dataField="dataFieldToRender"
        :organization="organization"
        :parentItem="parentItem"
        :release="release"
        @change="val => $emit('input', val, basePath)"
        @input="val => $emit('input', val, basePath)"
      />
      <div v-if="dataFieldToRender.type === 'ROW'" class="flex gap10 row-container">
        <template v-for="field in dataFieldToRender.fields">
          <DynamicInput
            vfor="field in dataFieldToRender.fields"
            :key="field.fieldName"
            :dataField="field"
            :basePath___="field.fieldName"
            :basePath="[basePath, field?.fieldName].filter(Boolean).join('.')"
            :organization="organization"
            :parentItem="parentItem"
            :release="release"
            :value="(field?.fieldName)? getVal(parentItem, [basePath, field?.fieldName].filter(Boolean).join('.')) : parentItem"
            @input="(val, path) => $emit('input', val, path)"
          />
        </template>
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
              :basePath="[basePath, idx+'', field.fieldName].filter(Boolean).join('.')"
              :value="getVal(currVal, field.fieldName) || ''"
              :organization="organization"
              :parentItem="parentItem"
              :release="release"
              @input="(val, path) => $emit('input', val, path || [basePath, idx+'', field.fieldName].filter(Boolean).join('.'))"
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
import { createItemForDynamicForm } from '../../../common/services/dynamicFormService';
import ReleasePicker from './ReleasePicker.vue';
import ReleaseIdsPicker from './ReleaseIdsPicker.vue';
import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import MultipleFilePicker from './MultipleFilePicker.vue';
import ImageCrop from './ImageCrop.vue';
import TableActionBtns from '@/apps/common/modules/common/cmps/TableActionBtns.vue';
import { range } from '@/apps/common/modules/common/services/util.service';


import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';

export default {
  name: 'DynamicInput',
  props: {
    dataField: [Object],
    value: [Object, String, Array, Number, Boolean],
    basePath: [String],
    parentItem: [Object],
    release: [Object],
    noTitle: [Boolean],
    organization: [Object]
  },
  data() {
    return {
      propsToPass: {},
      cmpName: '',
      dataFieldToRender: {...this.dataField}
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
      const _appendNewFile = (file) => {
        evManager.emit('file-uploaded', file);
      }
      const propsToPass = {...(this.dataField.propsToPass || {})};
      switch (type) {
        case 'TEXT':
        case 'DATE':
        case 'NUMBER':
          this.propsToPass = { ...propsToPass, type: type.toLowerCase(), placeholder: this.dataField.title };
          this.cmpName = 'FormInput';
          break;
        case 'SELECT':
          this.propsToPass = { ...propsToPass, type: 'select', items: this.dataField.options || [] };
          this.cmpName = 'FormInput';
          break;
        case 'SEPARATOR':
        case 'SEPARATOR_BOLD':
          this.cmpName = 'hr';
          if (type === 'SEPARATOR_BOLD') this.propsToPass = { ...propsToPass, style: 'border-width:3px' };
          break;
        case 'LONGRICHTEXT':
        case 'RICHTEXT':
          // this.propsToPass = { ...propsToPass, width: 400 };
          // this.propsToPass = { ...propsToPass, style: 'direction: ltr' };
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
          this.propsToPass = { ...propsToPass, hidden: true };
          this.cmpName = 'div';
          break;
        case 'RELEASES_SELECTOR': 
          this.cmpName = 'ReleasePicker'
          this.propsToPass = { ...propsToPass, organization: this.organization };
          break;

        case 'FILE':
        case 'VIDEO':
          this.cmpName = 'FileUploader';
          this.propsToPass = { ...propsToPass, accept: this.dataField.filter, uploadFolderName: this.organization._id, parentData: {col: 'release', _id: this.release._id}, onupload: val => _appendNewFile(val) };
          break;
        case 'IMAGE':
          this.cmpName = 'ImageCrop';
          this.propsToPass = { ...propsToPass, accept: this.dataField.filter, uploadFolderName: this.organization._id, parentData: {col: 'release', _id: this.release._id}, onupload: val => _appendNewFile(val) };
          break;

        // case 'FILE_SRC':
        //   this.cmpName = 'FileUploader';
        //   this.propsToPass = { ...propsToPass, accept: this.dataField.filter, onlySrc: true, uploadFolderName: this.organization._id };
        //   break;
        // case 'IMAGE_SRC':
        //   // this.cmpName = 'FileUploader';
        //   this.cmpName = 'ImageCrop';
        //   this.propsToPass = { ...propsToPass, viewAsImg: true, accept: this.dataField.filter, onlySrc: true, uploadFolderName: this.organization._id };
        //   break;
        // case 'IMAGEGALLERY':
        //   this.cmpName = 'MultipleFilePicker';
        //   this.propsToPass = { ...propsToPass, viewAsImg: true, isSingleItem: false, accept: this.dataField.filter };
        //   break;
        case 'SELECT_RELEASES_FROM_INNER_PARAM': // change to something like: SELECT_RELEASES_FROM_INNER_PARAM
          this.cmpName = 'ReleaseIdsPicker';
          this.propsToPass = { ...propsToPass, releases: this.parentItem[this.dataField.fromField], fromField: this.dataField.fromField };
          break;

        case 'MULTISELECT':
          this.cmpName = 'FormInput'
          this.propsToPass = { ...propsToPass, labelholder_: 'tags', type: 'multiselect', showVals: true, items: this.dataField.options  };
          break;

        // BAD: single items in array;
        case 'SINGLE-IMAGE_IN_ARRAY':
          // this.cmpName = 'ImageCrop';
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { ...propsToPass, viewAsImg: true, isSingleItem: true, accept: this.dataField.filter, uploadFolderName: this.organization._id, parentData: {col: 'release', _id: this.parentItem._id} };
          break;
        // case 'FILEINARRAY':
        case 'VIDEOINARRAY':
          this.cmpName = 'MultipleFilePicker';
          this.propsToPass = { ...propsToPass, isSingleItem: true, accept: this.dataField.filter, uploadFolderName: this.organization._id, parentData: {col: 'release', _id: this.parentItem._id} };
          break;


        // case 'IMAGEINARRAY':
        //   this.cmpName = 'MultipleFilePicker';
        //   this.propsToPass = { ...propsToPass, viewAsImg: true, isSingleItem: true, accept: this.dataField.filter };
        //   break;

        case 'LOGOSELECTION':
          this.cmpName = 'FormInput';
          this.propsToPass = { ...propsToPass, type: 'select', items: this.organization?.logos?.map(c => ({value: c.url, img: c.url, label: c.title})) || [] };
          break;
        case 'SELECTIONWITHIMAGE': // change to somethong like: IMG_SELECTION_FOR_VIDEO_LINK
          this.cmpName = 'FormInput';
          const _getYoutubeVideoThumb = (url, index = 0) => { // from old developer's code:
            if (!url) return '';
            const results = url.match('[\\?&]v=([^&#]*)');
            const video = results === null ? url : results[1];
            return `http://img.youtube.com/vi/${video}/maxres${index}.jpg`;
          };
          const videoUrl = getDeepVal(this.parentItem, this.basePath.replace(this.dataField.fieldName, this.dataField.linkedVideoField));
          this.propsToPass = { 
            ...propsToPass, 
            type: 'select', 
            items: range(4).map((_, idx) => {
              const currUrl = _getYoutubeVideoThumb(videoUrl, idx)
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
.megaphon-app {
  .dynamic-input {

    // h3 {
    //   color: var(--clr-0);
    // }
    &.input-field-SEPARATOR, .input-field-SEPARATOR_BOLD {
      h3 {
        color: var(--clr-4);
      }
    }

    max-width: 100%;
    // .dynamic-section, .input-container {
    //   width: 100%;
    //   // max-width: 100%;
    //   max-width: 90vw;
    //   overflow-x: auto;
    // }
    .row-container {
      // max-width: 100%;
      .dynamic-input {
        flex-direction: column !important;
        gap: em(5px);
      }
      @media (max-width: $small-screen-breake) {
        // flex-direction: column;
        flex-wrap: wrap;
      }
    }
    .table-container {
      width: 100%;
      max-width: 90vw;
      // max-width: 100%;
      // overflow-x: auto;
      table {
        // border-spacing: em(10px);
        width: 100%;
        // overflow-x: auto;
        td {
          padding: em(5px);
          vertical-align: top;
        }
      }
    }
    .quillWrapper {
      @media (max-width: $small-screen-breake) {
        max-width: 90vw; // TODO: 95;
        overflow-x: auto;
        margin: 0 auto;
      }
    }
    @media (max-width: $small-screen-breake) {
      flex-direction: column;
      gap: em(10px);
    }
  }
}
</style>
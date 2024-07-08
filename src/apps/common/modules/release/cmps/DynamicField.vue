<template>
  <div class="dynamic-input flex column gap10" v-if="dataFieldToRender && !dataFieldToRender.hideFromUi && value" :class="`input-field-${dataFieldToRender.type} ${dataFieldToRender.title}`">
    <h3 v-if="!noTitle && !dataFieldToRender.hideTitleFromUi && ((dataFieldToRender.title && (dataFieldToRender.type === 'SEPARATOR') || (dataFieldToRender.type !== 'SEPARATOR')))">{{dataFieldToRender.title}}</h3>
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
        @change="val => $emit('input', val, basePath)"
        @input="val => $emit('input', val, basePath)"
      >
        <template v-if="isTextual">{{value}}</template>
        <p v-else-if="bindContentToHtml" v-html="value"></p>
      </component>
      <div v-if="(dataFieldToRender.uiType || dataFieldToRender.type) === 'ROW'" class="flex gap10 row-container">
        <DynamicField
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
      <table v-if="(dataFieldToRender.uiType || dataFieldToRender.type) === 'TABLE'" colspacing="5px" class="flexx column gap10 width-content">
        <tr class="flexx align-center gap10" v-if="value && value.length">
          <td v-for="(field, idx) in dataFieldToRender.fields" :key="`${basePath}.${idx}.${field.title}`">
            <p class="flex-1" v-if="!field.hideTitleFromUi">
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
            <DynamicField
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
        </tr>
      </table>
    </div>
    <!-- <div v-if="dataField.fields">
    </div> -->
  </div>
</template>

<script>
import { getDeepVal, setDeepVal, range } from '@/apps/common/modules/common/services/util.service';
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import FilesSection from '../cmps/FilesSection.vue';
import ReleasesSlider from '../cmps/ReleasesSlider.vue'


export default {
  name: 'DynamicField',
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
      cmpName: this.dataField.uiCmp || '',
      dataFieldToRender: {...this.dataField},
      isTextual: false,
      bindContentToHtml: false
    }
  },
  methods: {
    initCmpData() {
      let type = this.dataField.uiType || this.dataField.type || '';
      type = type.toUpperCase();
      // if (['EMAIL', 'URL', 'VIDEOURL'].includes(type)) type = 'TEXT';
      // if (type === 'IMAGEGALLERY') {
      //   type = 'TABLE';
      //   this.dataFieldToRender = {
      //     ...this.dataField,
      //     type: 'TABLE',
      //     fields: [
      //       // {
      //       //   type: 'TEXT',
      //       //   fieldName: 'src',
      //       //   hidden: true
      //       // },
      //       {
      //         title: this.$t('photo'),
      //         type: 'IMAGE_SRC',
      //         fieldName: 'src',
      //       },
      //       {
      //         title: this.$t('title'),
      //         type: 'TEXT',
      //         fieldName: 'title',
      //       },
      //       {
      //         title: this.$t('credit'),
      //         type: 'TEXT',
      //         fieldName: 'credit',
      //       },
      //     ]
      //   }
      // }
      const propsToPass = {...(this.dataField.propsToPass || {})};
      switch (type) {
        case 'TEXT':
        case 'DATE':
        case 'NUMBER':
        case 'SELECTION':
          this.isTextual = true;
          this.propsToPass = { ...propsToPass };
          this.cmpName = this.dataField.uiCmp || 'p';
          break;
        case 'LONGRICHTEXT':
        case 'RICHTEXT':
          this.propsToPass = { ...propsToPass };
          this.bindContentToHtml = true;
          this.cmpName = 'p';
          break;
        case 'FilesSection'.toUpperCase():
          this.propsToPass = { ...propsToPass, release: { [this.dataField.fieldName]: this.value } };
          this.cmpName = 'FilesSection';
          break;
        case 'SEPARATOR':
        case 'SEPARATOR_BOLD':
          this.cmpName = 'hr';
          if (type === 'SEPARATOR_BOLD') this.propsToPass = { ...propsToPass, style: 'border-width:3px' };
          break;
        case 'TABLE':
        case 'ROW':
          this.propsToPass = { ...propsToPass, hidden: true };
          this.cmpName = 'div';
          break;
        case 'RELEASES_SELECTOR': 
          this.cmpName = 'ReleasesSlider'
          this.propsToPass = { ...propsToPass, releases: this.value };
          break;

        case 'FILE':
        case 'VIDEO':
          this.cmpName = 'FileUploader';
          this.propsToPass = { ...propsToPass, accept: this.dataField.filter };
          break;
        case 'IMAGE':
        case 'IMAGE_SRC':
        case 'CORPABLE_IMAGE':
          this.cmpName = 'img';
          this.propsToPass = { ...propsToPass, src: this.value?.src || this.value };
          break;

        case 'FILE_SRC':
          this.cmpName = 'FileUploader';
          this.propsToPass = { ...propsToPass, accept: this.dataField.filter, onlySrc: true };
          break;

        case 'SELECT_RELEASES_FROM_INNER_PARAM': // change to something like: SELECT_RELEASES_FROM_INNER_PARAM
          this.cmpName = 'template';
          this.propsToPass = { ...propsToPass, releases: this.parentItem[this.dataField.fromField], fromField: this.dataField.fromField };
          break;

        case 'FILEINARRAY':
        case 'VIDEOINARRAY':
          this.cmpName = 'template';
          this.propsToPass = { ...propsToPass, isSingleItem: true, accept: this.dataField.filter };
          break;


        // case 'LOGOSELECTION':
        //   this.cmpName = 'FormInput';
        //   this.propsToPass = { ...propsToPass, type: 'select', items: this.organization?.logos?.map(c => ({value: c.url, img: c.url, label: c.title})) || [] };
        //   break;
        // case 'SELECTIONWITHIMAGE': // change to somethong like: IMG_SELECTION_FOR_VIDEO_LINK
        //   this.cmpName = 'FormInput';
        //   const _getYoutubeVideoThumb = (url, index = 0) => { // from old developer's code:
        //     if (!url) return '';
        //     const results = url.match('[\\?&]v=([^&#]*)');
        //     const video = results === null ? url : results[1];
        //     return `http://img.youtube.com/vi/${video}/maxres${index}.jpg`;
        //   };
        //   const videoUrl = getDeepVal(this.parentItem, this.basePath.replace(this.dataField.fieldName, this.dataField.linkedVideoField));
        //   this.propsToPass = { 
        //     ...propsToPass, 
        //     type: 'select', 
        //     items: range(4).map((_, idx) => {
        //       const currUrl = _getYoutubeVideoThumb(videoUrl, idx)
        //       return {value: currUrl, img: currUrl, label: `${this.$t('photo')} ${idx+1}`};
        //     })
        //   };
        //   break;

        default: 
          this.cmpName = 'UNKNOWN';
          break;

        
      }
      if (this.dataField.props) this.propsToPass = { ...this.propsToPass, ...this.dataField.props };
    },
    getVal(item, fieldPath) {
      return getDeepVal(item, fieldPath);
    }
  },
  mounted() {
    this.initCmpData();
  },
  components: { 
    FormInput,
    FileUploader,
    FilesSection,
    ReleasesSlider
    // FileInput
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .dynamic-input {
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
      overflow-x: auto;
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
    
    @media (max-width: $small-screen-breake) {
      flex-direction: column;
      gap: em(10px);
    }
  }
}
</style>
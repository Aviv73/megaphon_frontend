<template>
  <div class="dynamic-field flex column gap10" v-if="dataFieldToRender && !dataFieldToRender.hideFromUi && (valueToShow || (typeToShow === 'ROW')) && !hidden" :class="`field-field-${typeToShow} ${dataFieldToRender.title}`">
    <h3 class="field-title" v-if="!noTitle && !dataFieldToRender.hideTitleFromUi && (dataFieldToRender.title)">{{tOrTitle(dataFieldToRender.uiTitle || dataFieldToRender.title)}}</h3>
    <div class="flex-1 field-container" :class="{'table-container': typeToShow === 'TABLE'}">
      <p v-if="cmpName === 'UNKNOWN'">UNKNOWN INPUT TYPE "{{typeToShow}}"</p>
      <component
        v-else
        class="flex-1 dynamic-section"
        :is="cmpName" 
        ref="field"
        v-bind="propsToPass" 
        :value="valueToShow"
        :dataField="dataFieldToRender"
        :organization="organization"
        :parentItem="parentItem"
        :release="release"
      >
        <p v-if="bindContentToHtml" v-html="valueToShow"></p>
        <template v-else>{{valueToShow}}</template>
      </component>
      <div v-if="(typeToShow) === 'ROW'" class="flex gap30 row-container">
        <DynamicField
          v-for="(field, idx) in dataFieldToRender.fields"
          :key="field.fieldName || idx"
          :dataField="field"
          :basePath="field.fieldName"
          :organization="organization"
          :parentItem="parentItem"
          :release="release"
          :value="getVal(parentItem, field.fieldName)"
        />
      </div>
      <table v-if="(typeToShow) === 'TABLE'" colspacing="5px" class="flexx column gap10 width-content">
        <tr class="flexx align-center gap10" v-if="valueToShow && valueToShow.length">
          <th v-for="(field, idx) in dataFieldToRender.fields" :key="`${basePath}.${idx}.${field.title}`">
            <p class="flex-1" v-if="!field.hideTitleFromUi">
              {{tOrTitle(field.uiTitle || field.title)}}
            </p>
          </th>
          <th class="flex-1"></th>
        </tr>
        <tr v-for="(currVal, idx) in valueToShow" :key="idx" class="flexx align-center gap10">
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
              :release="release"
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
import { Utils } from '@/apps/common/modules/common/services/util.service';
// import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
// import FileUploader from '@/apps/common/modules/common/cmps/file/FileUploader.vue';
import FilesSection from './FilesSection.vue';
// import FileList from './FileList.vue';
import FilesSingleSection from './FilesSingleSection.vue';
import ReleasesSlider from './ReleasesSlider.vue'
import { validateDataByDataField } from '../../../../megaphonApp/modules/common/services/dynamicFormService';
import { fixFileSrcToThumbnail } from '../../common/services/file.service';


export default {
  name: 'DynamicField',
  props: {
    dataField: [Object],
    value: [Object, String, Array, Number, Boolean],
    basePath: [String],  // ?
    parentItem: [Object],  // ?
    noTitle: [Boolean],  // ?
    organization: [Object],  // ?
    release: [Object]  // ?
  },
  data() {
    return {
      propsToPass: {},
      cmpName: this.dataField.uiCmp || '',
      dataFieldToRender: {...this.dataField},
      bindContentToHtml: false,
      valueToShow: this.value,
      hidden: false,
      typeToShow: ''
    }
  },
  methods: {
    tOrTitle(subKey) {
      if (!subKey) return subKey;
      const key = `releaseLocales.dataFields.${subKey}`;
      return this.$te(key) ? this.$t(key) : subKey;
    },
    initCmpData() {
      this.typeToShow = this.dataField.uiType || this.dataField.type || '';
      this.typeToShow = this.typeToShow.toUpperCase();
      const propsToPass = {...(this.dataField.propsToPass || {})};
      this.valueToShow = this.value;
      this.cmpName = 'p';
      if (!validateDataByDataField(this.dataField, this.value, undefined, this.release)) {
        this.hidden = true;
        return
      }
      switch (this.typeToShow) {
        case 'NUMBER':
          this.propsToPass = { ...propsToPass };
          this.cmpName = this.dataField.uiCmp || 'p';
          break;
        case 'TEXT':
        case 'SELECT':
        case 'EMAIL':
          // if (!this.value?.trim?.()) this.hidden = true;
          this.propsToPass = { ...propsToPass };
          this.cmpName = this.dataField.uiCmp || 'p';
          break;
        case 'DATE':
          this.valueToShow = Utils.Time.getTimeStrAs(this.value, 'date/month/year');
          break;
        case 'LONGRICHTEXT':
        case 'RICHTEXT':
          // if (!this.value?.trim?.()) this.hidden = true;
          this.propsToPass = { ...propsToPass };
          this.bindContentToHtml = true;
          this.cmpName = 'p';
          break;
        case 'FilesSection':
        case 'FilesSection'.toUpperCase(): // TODO:: NO NEED?
          // if (!this.value?.length) this.hidden = true;
          this.propsToPass = { ...propsToPass, organizationId: this.organization._id, rootItem: this.release, showTitle: false, releaseData: { [this.dataField.fieldName]: this.value } };
          this.cmpName = 'FilesSection';
          break;
        case 'VIDEOS'.toUpperCase():
          this.cmpName = 'FilesSingleSection';
          this.propsToPass = { ...propsToPass, rootItem: this.release, showTitle: false, sectionId: 'videos', cmpType: 'iframe', organizationId: this.organization._id, files: this.value?.map(c => {
            const src = c.src || c.link || c.url; 
            return {...c, src: Utils.youtubeService.isYoutubeVid(src)? Utils.youtubeService.embedUtubeUrl(src) : src};
          }) || [] };
          break;
        case 'links'.toUpperCase():
          this.cmpName = 'FilesSingleSection';
          this.propsToPass = { ...propsToPass, rootItem: this.release, showTitle: false, sectionId: 'links', cmpType: 'link', organizationId: this.organization._id, files: this.value }
          break;
        case 'IMAGEGALLERY'.toUpperCase():
          this.cmpName = 'FilesSingleSection';
          this.propsToPass = { ...propsToPass, rootItem: this.release, showTitle: false, sectionId: 'images', cmpType: 'img', organizationId: this.organization._id, files: this.value }
          break;
        case 'SEPARATOR':
        case 'LIGHT_SEPARATOR':
        case 'SEPARATOR_BOLD':
          this.hidden = true
          this.cmpName = 'hr';
          if (this.typeToShow === 'SEPARATOR_BOLD') this.propsToPass = { ...propsToPass, style: 'border-width:3px' };
          break;
        // case 'ROW':
        // case 'TABLE':
        //   if (!this.value?.length) this.hidden = true;
        case 'TABLE':
        case 'ROW':
          this.propsToPass = { ...propsToPass, hidden: true };
          this.cmpName = 'div';
          break;
        case 'RELEASES_SELECTOR': 
          this.cmpName = 'ReleasesSlider'
          this.propsToPass = { ...propsToPass, releases: this.value };
          break;

        case 'IMAGE':
        // case 'IMAGE_SRC':
          this.cmpName = 'img';
          this.propsToPass = { ...propsToPass, src: fixFileSrcToThumbnail(this.value, this.release) };
          break;
          
        function tagList(tags) {
          // return tags.join(this.dataField.props?.seperator || ', ');
          return `
            <div class="tag-lest flex align-center wrap gap15">
              ${
                tags.map(c => `<span>${c}</span>`).join('')
              }
            </div>
          `;
        }

        case 'MULTISELECT':
          this.cmpName = 'p';
          this.bindContentToHtml = true;
          this.valueToShow = tagList(this.value);
          break;
        case 'MULTISELECT_VALUE_TO_LABEL':
          this.cmpName = 'p';
          this.bindContentToHtml = true;
          this.valueToShow = tagList(this.value.map(val => this.tOrTitle(this.dataField.options.find(c => c.value === val)?.label)).filter(Boolean));
          break;

        case 'SELECT_VALUE_TO_LABEL':
          this.cmpName = 'p';
          this.valueToShow = this.tOrTitle(this.dataField.options.find(c => c.value === this.value)?.label)
          break;


        case 'FILE_SRC':
          this.cmpName = 'FileUploader';
        //   this.propsToPass = { ...propsToPass, accept: this.dataField.filter, onlySrc: true };
        //   break;

        case 'SELECT_RELEASES_FROM_INNER_PARAM': // change to something like: SELECT_RELEASES_FROM_INNER_PARAM
          this.cmpName = 'template';
          this.propsToPass = { ...propsToPass, releases: this.parentItem[this.dataField.fromField], fromField: this.dataField.fromField };
          break;

        case 'FILE':
          this.cmpName = 'a';
          this.valueToShow = this.dataField.title;
          this.propsToPass = { ...propsToPass, href: fixFileSrcToThumbnail(this.value, this.release), target: '_blank' };
          break;
        
        
        case 'URL':
        // case 'VIDEOURL':
          this.cmpName = 'a';
          this.propsToPass = { ...propsToPass, href: this.value, target: '_blank' };
          break;

      
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
        //   const videoUrl = Utils.getDeepVal(this.parentItem, this.basePath.replace(this.dataField.fieldName, this.dataField.linkedVideoField));
        //   this.propsToPass = { 
        //     ...propsToPass, 
        //     type: 'select', 
        //     items: Utils.range(4).map((_, idx) => {
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
      return Utils.getDeepVal(item, fieldPath);
    }
  },
  mounted() {
    this.initCmpData();
  },
  components: { 
    // FormInput,
    // FileUploader,
    FilesSection,
    // FileList,
    FilesSingleSection,
    ReleasesSlider
    // FileInput
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .megaphon-app {
  .dynamic-field {
   
    
    @media (max-width: $small-screen-break) {
      flex-direction: column;
      gap: em(10px);
    }

    td, th {
      p {
        text-align: start;
      }
      padding: 0 0 em(10px) em(20px);
      &:first-child {
        padding-inline-start: 0;
      }
    }
    th {
      font-weight: bold;
    }
    
    a {
      color: blue;
      text-decoration: underline !important;
      cursor: pointer;
    }

    // iframe, video, .media-item {
    //   box-shadow: $light-shadow;
    //   height: 600px;
    //   width: 100%;
    // }
  }
// }
</style>
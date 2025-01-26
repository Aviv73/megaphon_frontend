<template>
    <div :id="sectionId" class="files-single-section flex column gap20 width-all">
      <h2 v-if="title && showTitle">{{title}}</h2>
      <FileList :rootItem="rootItem" :files="files" :cmpType="cmpType" :organizationId="organizationId"/>
    </div>
</template>

<script>
import FileList from './FileList.vue';
export default {
  name: 'FilesSingleSection',
  components: { FileList },
  props: {
    files: {
      type: Array
    },
    title: {
      type: String,
    },
    sectionId: {
      type: String
    },
    cmpType: {
      type: String
    },
    organizationId: {
      type: String
    },
    rootItem: {
      type: Object
    },
    showTitle: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>

</style>
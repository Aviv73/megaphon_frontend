<template>
    <div :id="sectionId" class="flex column gap20 width-all">
      <h2 v-if="title">{{title}}</h2>
      <FileList :files="files" :cmpType="cmpType"/>
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
    }
  }
}
</script>

<style>

</style>
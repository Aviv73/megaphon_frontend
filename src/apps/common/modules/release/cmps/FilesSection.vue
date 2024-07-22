<template>
    <div class="files-section flex column gap40">
      <FilesSingleSection v-if="images.length" sectionId="images" :title="$t('images')" cmpType="img" :files="images"/>
      <FilesSingleSection v-if="videos.length" sectionId="videos" :title="$t('videos')" cmpType="video" :files="videos"/>
      <FilesSingleSection v-if="files.length" sectionId="files" :title="$t('files')" cmpType="file" :files="files"/>
      <FilesSingleSection v-if="links.length" sectionId="links" :title="$t('links')" cmpType="link" :files="links"/>
    </div>
</template>

<script>
import { filterFilesCb } from './file.service';
import FileList from './FileList.vue';
import FilesSingleSection from './FilesSingleSection.vue';
export default {
  components: { FileList, FilesSingleSection },
  name: 'FilesSection',
  props: {
    release: {
      type: Object
    }
  },
  methods: {
    filterItemsfromRelease(...keys) {
      for (let key of keys) {
        if (this.release[key]) return this.release[key]?.filter(filterFilesCb) || [];
      }
      return [];
    } 
  },
  computed: {
    images() {
      return this.filterItemsfromRelease('images', 'imageGallery');
    },
    videos() {
      return this.filterItemsfromRelease('videos');
    },
    files() {
      return this.filterItemsfromRelease('files');
    },
    links() {
      return this.filterItemsfromRelease('links');
    },
  }
}
</script>

<style>

</style>
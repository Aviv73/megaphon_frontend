<template>
    <div class="files-section flex column gap40">
      <FilesSingleSection :rootItem="rootItem" :organizationId="organizationId" v-if="images.length" sectionId="images" :title="$t('images')" cmpType="img" :files="images"/>
      <FilesSingleSection :rootItem="rootItem" :organizationId="organizationId" v-if="videos.length" sectionId="videos" :title="$t('videos')" cmpType="video" :files="videos"/>
      <FilesSingleSection :rootItem="rootItem" :organizationId="organizationId" v-if="files.length" sectionId="files" :title="$t('files')" cmpType="file" :files="files"/>
      <FilesSingleSection :rootItem="rootItem" :organizationId="organizationId" v-if="links.length" sectionId="links" :title="$t('links')" cmpType="link" :files="links"/>
    </div>
</template>

<script>
import { fixFileSrcToThumbnail } from '../../common/services/file.service';
// import { filterFilesCb } from './file.service';
import FilesSingleSection from './FilesSingleSection.vue';
export default {
  components: { FilesSingleSection },
  name: 'FilesSection',
  props: {
    releaseData: {
      type: Object
    },
    rootItem: {
      type: Object
    },
    organizationId: [String]
  },
  methods: {
    filterItemsfromRelease(...keys) {
      for (let key of keys) {
        if (this.releaseData[key]) return this.releaseData[key]?.filter(c => fixFileSrcToThumbnail(c, this.rootItem)) || [];
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
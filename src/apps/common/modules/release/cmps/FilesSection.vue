<template>
    <div class="files-section flex column gap40">
      <div id="images" v-if="images.length" class="flex column gap20">
        <h2>{{$t('images')}}</h2>
        <FileList :files="images" cmpType="img"/>
      </div>
      <div id="videos" v-if="videos.length" class="flex column gap20">
        <h2>{{$t('videos')}}</h2>
        <FileList :files="videos" cmpType="video"/>
      </div>
      <div id="files" v-if="files.length" class="flex column gap20">
        <h2>{{$t('files')}}</h2>
        <FileList :files="files" cmpType="file"/>
      </div>
      <div id="links" v-if="links.length" class="flex column gap20">
        <h2>{{$t('links')}}</h2>
        <FileList :files="links" cmpType="link"/>
      </div>
    </div>
</template>

<script>
import FileList from './FileList.vue';
export default {
  components: { FileList },
  name: 'FilesSection',
  props: {
    release: {
      type: Object
    }
  },
  methods: {
    filterItemsfromRelease(key) {
      return this.release[key]?.filter(c => c.src) || [];
    } 
  },
  computed: {
    images() {
      return this.filterItemsfromRelease('images');
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
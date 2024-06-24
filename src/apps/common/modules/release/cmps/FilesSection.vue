<template>
    <div class="files-section flex column gap40">
      <div id="images" v-if="release.images?.filter(c => c.src).length" class="flex column gap20">
        <h2>{{$t('images')}}</h2>
        <FileList :files="release.images.filter(c => c.src)" cmpType="img"/>
      </div>
      <div id="videos" v-if="release.videos?.filter(c => c.src).length" class="flex column gap20">
        <h2>{{$t('videos')}}</h2>
        <FileList :files="release.videos.filter(c => c.src)" cmpType="video"/>
      </div>
      <div id="files" v-if="release.files?.filter(c => c.src).length" class="flex column gap20">
        <h2>{{$t('files')}}</h2>
        <FileList :files="release.files.filter(c => c.src)" cmpType="file"/>
      </div>
      <div id="links" v-if="release.links?.filter(c => c.src).length" class="flex column gap20">
        <h2>{{$t('links')}}</h2>
        <FileList :files="release.links.filter(c => c.src)" cmpType="link"/>
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
  }
}
</script>

<style>

</style>
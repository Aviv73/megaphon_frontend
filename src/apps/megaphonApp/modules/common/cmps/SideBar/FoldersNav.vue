<template>
  <div class="folders-container">
    <div class="nav-list-item inner-list-item flex align-center gap10" @click="showFolders = !showFolders">
      <Avatar class="folder-avatar" :size="40"><img :src="require('@/apps/megaphonApp/assets/images/image_placeholder.png')"/></Avatar>
      <p>{{$t('folders')}}</p>
    </div>
    <FolderList v-if="showFolders" :folders="folders" :parentItem="parentItem"/>
  </div>
</template>

<script>
import Avatar from '../../../../../common/modules/common/cmps/Avatar.vue';
import FolderList from './FolderList.vue';
export default {
  name: 'FoldersNav',
  props: {
    folders: {
      type: Array,
      default: () => []
    },
    parentItem: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showFolders: false
    }
  },
  components: { Avatar, FolderList }
}
</script>

<style lang="scss">
.megaphon-app {
  .folders-container{

  }
}
</style>
<template>
  <div class="folders-container">
    <div class="nav-list-item inner-list-item flex align-center gap10" @click="showFolders = !showFolders">
      <Avatar class="folder-avatar" :size="40" :img="require('@/apps/megaphonApp/assets/images/folder.svg')"/>
      <p>{{$t('sidebar.folders')}}</p>
    </div>
    <FolderList :currentDropableFolderPath="currentDropableFolderPath" v-if="showFolders" :folders="folders" :parentItem="parentItem"/>
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
    },
    currentDropableFolderPath: {
      type: String,
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
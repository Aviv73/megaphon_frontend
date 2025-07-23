<template>
  <div class="folder-list-container" :style="{ paddingInlineStart: (depth+1) * 10 + 'px' }">
    <div class="folder-list" v-for="folder in folders.filter(Boolean)" :key="getFolderRelativeName(folder)">
      <DropDiv @dragleave="selectDropable(null)" @dragenter="selectDropable(getFolderRelativeName(folder))" :onDrop="() => addReleasesToFolder(folder, getFolderRelativeName(folder))">
        <div :class="{ dropable: currentDropableFolderPath === getFolderRelativeName(folder) }" class="nav-list-item inner-list-item flex align-center gap5 space-between width-all">
          <div class="flex align-center gap5" @click="selectFolder(getFolderRelativeName(folder), folder)">
            <Avatar class="folder-avatar" :size="40" :img="require('@/apps/megaphonApp/assets/images/folder.svg')"/>
            <p>{{folder?.name || ''}}</p>
          </div>
          <button @click="removeFolder(getFolderRelativeName(folder))">X</button>
        </div>
      </DropDiv>
      <FolderList v-if="folder.children" :currentDropableFolderPath="currentDropableFolderPath" :folders="folder.children" :parentPath="getFolderRelativeName(folder)" :parentItem="parentItem"/>
      <!-- <form v-if="depth === 1" @submit.prevent="addFolder($event, parentPath)" class="add-folder-input-container nav-list-item inner-list-item">
        <FormInput placeholder="sidebar.addFolder" value=""/>
        <button type="submit">+</button>
        {{depth}}
      </form> -->
    </div>
    <form v-if="depth < 2" @submit.prevent="addFolder($event, parentPath)" class="add-folder-input-container nav-list-item inner-list-item flex align-center gap5">
       <Avatar class="folder-avatar" :size="40" :img="require('@/apps/megaphonApp/assets/images/folder.svg')"/>
      <FormInput placeholder="sidebar.addFolder" value=""/>
      <button type="submit">+</button>
    </form>
  </div>
</template>

<script>
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import Avatar from '../../../../../common/modules/common/cmps/Avatar.vue';
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import DropDiv from '../dnd/DropDiv.vue';
export default {
  components: { Avatar, FormInput, DropDiv },
  name: 'FolderList',
  props: {
    folders: {
      type: Array,
      default: () => []
    },
    parentPath: {
      type: String,
      default: ''
    },
    parentItem: {
      type: Object,
      default: () => {}
    },
    currentDropableFolderPath: {
      type: String,
    }
  },
  computed: {
    depth() {
      return this.parentPath.split('/').filter(Boolean).length;
    }
  },
  methods: {
    getFolderRelativeName(folder) {
      return [this.parentPath, folder.name].filter(Boolean).join('/')
    },
    addFolder(ev, parentPath) {
      const elInput = ev.target.querySelector('input')
      const val = elInput.value;
      if (!val) return;
      elInput.value = '';
      const newFolderPath = [parentPath, val].join('/');
      evManager.emit('create-new-folder', this.parentItem._id, newFolderPath);
    },
    removeFolder(foldPath) {
      evManager.emit('remove-folder', this.parentItem._id, foldPath);
    },

    selectFolder(foldPath, folder) {
      evManager.emit('folder-selected', foldPath, folder);
    },

    addReleasesToFolder(folder, foldPath) {
      evManager.emit('folder-updated', this.parentItem._id, foldPath, folder);
    },

    selectDropable(folderPath) {
      evManager.emit('current-dropable-folder', folderPath);
    }
  }
}
</script>

<style>

</style>
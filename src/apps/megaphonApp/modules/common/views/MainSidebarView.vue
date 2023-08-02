<template>
  <section class="container main-sidebar-view flex-1 flex align-stretch gap10">
    <SideBar :currentDropableFolderPath="currentDropableFolderPath" :organizations="organizations" :loggedUser="loggedUser"/>
    <router-view :selectedReleaseIds="selectedReleaseIds" class="flex-1"/>
  </section>
</template>

<script>
import SideBar from '../cmps/SideBar/SideBar.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
export default {
  components: { SideBar },
  name: 'MainSidebarView',
  data() {
    return  {
      selectedReleaseIds: [],
      currentDropableFolderPath: null
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    organizations() {
      return this.$store.getters['organization/items'].reverse();
    },
    selectedOrgId() {
      return this.$route.params.organizationId;
    },
    selectedFolderPath() {
      return this.$store.getters['organization/selectedFolderPath']
    },
    selectedFolder() {
      return this.$store.getters['organization/selectedFolder']
    },
  },
  created() {
    this.initNavigation();
    this.$store.dispatch({ type: 'organization/loadItems' });
    this.loadSelectedOrg();
    
    evManager.on('create-new-folder', this.createNewFolder);
    evManager.on('remove-folder', this.removeOrUpdateFolder);
    evManager.on('folder-updated', this.handlewFolderUpdated);
    evManager.on('folder-selected', this.handleFolderSelection);
    evManager.on('toggleRelease-from-selected', this.handleReleaseToggleSelection);
    evManager.on('current-dropable-folder', this.handleCurrentDropableFolderPathSelected);
  },
  destroyed() {
    evManager.off('create-new-folder', this.createNewFolder);
    evManager.off('remove-folder', this.removeOrUpdateFolder);
    evManager.off('folder-updated', this.handlewFolderUpdated);
    evManager.off('folder-selected', this.handleFolderSelection);
    evManager.off('toggleRelease-from-selected', this.handleReleaseToggleSelection);
    evManager.off('current-dropable-folder', this.handleCurrentDropableFolderPathSelected);
  },
  methods: {
    initNavigation() {
      if (this.$route.name === 'MainSidebarView') {
        const firstOrg = this.loggedUser?.organizations.filter(c => c.organizationId != '-1')[0];
        if (!firstOrg) return;
        this.$router.push({name: 'ReleasePage', params: {organizationId: firstOrg.organizationId}});
      }
    },
    loadSelectedOrg() {
      const id = this.selectedOrgId;
      if (id == '-1') return;
      this.$store.dispatch({ type: 'organization/loadItem', id });
    },
    
    createNewFolder(orgId, newFolderPath) {
      const orgToEdit = JSON.parse(JSON.stringify(this.organizations.find(c => c._id === orgId)));
      if (!orgToEdit.folders) orgToEdit.folders = [];
      const splitedFolderPath = newFolderPath.split('/').filter(Boolean);
      let currFolders = orgToEdit.folders
      for (let currFoldName of splitedFolderPath) {
        let currFolder = currFolders.find(c => c.name === currFoldName);
        if (!currFolder) {
          currFolder = { name: currFoldName, children: [], content: [] };
          currFolders.push(currFolder);
        }
        currFolders = currFolder.children;
      }
      this.updateOrg(orgToEdit);
    },
    async removeOrUpdateFolder(orgId, foldPath = '', newItem = undefined) {
      const orgToEdit = JSON.parse(JSON.stringify(this.organizations.find(c => c._id === orgId)));
      if (!orgToEdit.folders) orgToEdit.folders = [];
      const splitedFolderPath = foldPath.split('/').filter(Boolean);
      let currFolders = orgToEdit.folders
      for (let i = 0; i < splitedFolderPath.length; i++) {
        const currFoldName = splitedFolderPath[i];
        let currFolderIdx = currFolders.findIndex(c => c.name === currFoldName);
        if (currFolderIdx === -1) return;

        if (i === splitedFolderPath.length-1) {
          currFolders.splice(currFolderIdx, 1, newItem);
        } else {
          currFolders = currFolders[currFolderIdx].children;
        }
      }
      return this.updateOrg(orgToEdit);
    },

    toggleFolderContent(folder, releaseIds) {
      const folderToUpdate = JSON.parse(JSON.stringify(folder));
      if (!folderToUpdate.content) folderToUpdate.content = [];
      releaseIds.forEach(relId => {
        const idx = folderToUpdate.content.indexOf(relId);
        if (idx === -1) folderToUpdate.content.push(relId);
        else folderToUpdate.content.splice(idx, 1);
      });
      return folderToUpdate;
    },
    async handlewFolderUpdated(orgId, foldPath, folder) {
      console.log(this.selectedReleaseIds);
      if (folder) {
        await this.removeOrUpdateFolder(orgId, foldPath, this.toggleFolderContent(folder, this.selectedReleaseIds));
      }
      if (this.selectedFolder) {
        const newSelectedFolder = this.toggleFolderContent(this.selectedFolder, this.selectedReleaseIds);
        await this.removeOrUpdateFolder(orgId, this.selectedFolderPath, newSelectedFolder);
        // this.handleFolderSelection(this.selectedFolderPath, newSelectedFolder);
        evManager.emit('folder-selected', this.selectedFolderPath, newSelectedFolder);
      }
      this.selectedReleaseIds = [];
    },

    async updateOrg(orgToUpdate) {
      await this.$store.dispatch({ type: 'organization/saveItem', item: orgToUpdate });
      this.$store.dispatch({ type: 'organization/loadItems' });
    },

    

    handleFolderSelection(folderPath, folder) {
      this.$store.commit({ type: 'organization/setSelectedFolder', folderPath, folder })
      this.selectedReleaseIds = [];
    },

    handleReleaseToggleSelection(releaseId, isDraging) {
      const idx = this.selectedReleaseIds.indexOf(releaseId);
      if (idx === -1) this.selectedReleaseIds.push(releaseId);
      else if (!isDraging) this.selectedReleaseIds.splice(idx, 1);
    },

    handleCurrentDropableFolderPathSelected(currentDropableFolderPath) {
      this.currentDropableFolderPath = currentDropableFolderPath;
    }
  },
  watch: {
    selectedOrgId(id) {
      this.selectedReleaseIds = [];
      this.loadSelectedOrg(id);
    },
    loggedUser(val, prev) {
      if (val?._id === prev?._id) return;
      this.initNavigation();
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .main-sidebar-view {
    >* {
      padding: em(10px);
    }
  }
}
</style>
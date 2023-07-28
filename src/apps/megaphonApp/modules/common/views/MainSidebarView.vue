<template>
  <section class="container main-sidebar-view flex-1 flex align-stretch gap10">
    <SideBar :organizations="organizations" :loggedUser="loggedUser"/>
    <router-view class="flex-1"/>
  </section>
</template>

<script>
import SideBar from '../cmps/SideBar/SideBar.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
export default {
  components: { SideBar },
  name: 'MainSidebarView',
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    organizations() {
      return this.$store.getters['organization/items'].reverse();
    },
    selectedOrgId() {
      return this.$route.params.organizationId;
    }
  },
  created() {
    this.initNavigation();
    this.$store.dispatch({ type: 'organization/loadItems' });
    this.loadSelectedOrg();
    
    evManager.on('create-new-folder', this.createNewFolder);
    evManager.on('remove-folder', this.removeFolder);
  },
  destroyed() {
    evManager.off('create-new-folder', this.createNewFolder);
    evManager.off('remove-folder', this.removeFolder);
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
      this.$store.dispatch({ type: 'organization/loadItem', organizationId: id });
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
    removeFolder(orgId, foldPath) {
      const orgToEdit = JSON.parse(JSON.stringify(this.organizations.find(c => c._id === orgId)));
      if (!orgToEdit.folders) orgToEdit.folders = [];
      const splitedFolderPath = foldPath.split('/').filter(Boolean);
      let currFolders = orgToEdit.folders
      for (let i = 0; i < splitedFolderPath.length; i++) {
        const currFoldName = splitedFolderPath[i];
        let currFolderIdx = currFolders.findIndex(c => c.name === currFoldName);
        if (currFolderIdx === -1) return;

        if (i === splitedFolderPath.length-1) {
          currFolders.splice(currFolderIdx, 1);
        } else {
          currFolders = currFolders[currFolderIdx].children;
        }
      }
      this.updateOrg(orgToEdit);
    },

    async updateOrg(orgToUpdate) {
      await this.$store.dispatch({ type: 'organization/saveItem', item: orgToUpdate });
      this.$store.dispatch({ type: 'organization/loadItems' });
    }
  },
  watch: {
    selectedOrgId(id) {
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
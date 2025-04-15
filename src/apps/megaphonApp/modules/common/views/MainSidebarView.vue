<template>
  <section class="full-screen-container main-sidebar-view flex-1 flex align-stretch gap10">
    <Loader v-if="isLoading"/>
    <SideBar v-if="!isUserWatchOnly" :currentDropableFolderPath="currentDropableFolderPath" :organizations="organizationsToShow" :loggedUser="loggedUser"/>
    <router-view :selectedReleaseIds="selectedReleaseIds" class="flex-1"/>
  </section>
</template>

<script>
import SideBar from '../cmps/SideBar/SideBar.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { organizationService } from '../../organization/services/organization.service';
import appConfig from '../../../../../appConfig';
import { consts } from '@/apps/common/modules/common/services/const.service.js';
// import { setDynamicStylingThemeEl } from '@/apps/common/modules/common/services/dynamicPages.service';
import allThemes from '../../../themes/index';
import Loader from '../../../../common/modules/common/cmps/Loader.vue';
export default {
  components: { SideBar, Loader },
  name: 'MainSidebarView',
  data() {
    return  {
      selectedReleaseIds: [],
      currentDropableFolderPath: null,
      isLoading: false
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    organizations() {
      return [...this.$store.getters['organization/items']].reverse();
    },
    isSingleOrgMode() {
      return appConfig.singleOrgMode;
    },
    organizationsToShow() {
      return this.getOnlyOrgsToShow(this.organizations, appConfig);
      // if (appConfig.appOrganizationId) return [this.organizations.find(c => [c._id, c.domain].includes(appConfig.appOrganizationId))].filter(Boolean);
      // return this.organizations;
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
    isUserWatchOnly() {
      return this.$store.getters['auth/isWatchOnly'];
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    }
  },
  async created() {
    this.isLoading = true;
    await this.$store.dispatch({ type: 'organization/loadItems' });
    this.isLoading = false;
    this.initNavigation();
    this.loadSelectedOrg();
    
    evManager.on('create-new-folder', this.createNewFolder);
    evManager.on('remove-folder', this.removeOrUpdateFolder);
    evManager.on('folder-updated', this.handlewFolderUpdated);
    evManager.on('folder-selected', this.handleFolderSelection);
    evManager.on('toggleRelease-from-selected', this.handleReleaseToggleSelection);
    evManager.on('current-dropable-folder', this.handleCurrentDropableFolderPathSelected);
    evManager.on('org-release-filter', this.handleReleaseFilterChanged);
  },
  destroyed() {
    evManager.off('create-new-folder', this.createNewFolder);
    evManager.off('remove-folder', this.removeOrUpdateFolder);
    evManager.off('folder-updated', this.handlewFolderUpdated);
    evManager.off('folder-selected', this.handleFolderSelection);
    evManager.off('toggleRelease-from-selected', this.handleReleaseToggleSelection);
    evManager.off('current-dropable-folder', this.handleCurrentDropableFolderPathSelected);
    evManager.off('org-release-filter', this.handleReleaseFilterChanged);
  },
  methods: {
    getOnlyOrgsToShow: organizationService.getOnlyOrgsToShow,
    // getOnlyOrgsToShow(orgs) {
    //   // if (appConfig.appOrganizationId) return [orgs.find(c => [c._id, c.domain].includes(appConfig.appOrganizationId))].filter(Boolean);
    //   // if (this.$store.getters['auth/isWatchOnly']) {
    //   //   return orgs.filter(c => !c.isStandAlone);
    //   // }
    //   // return orgs;
    //   return organizationService.getOnlyOrgsToShow(orgs, appConfig);
    // },
    initNavigation() {
      console.log(this.$route);
      if (!this.loggedUser) return;
      if (this.$route.name === 'MainSidebarView') {
        const firstOrg = 
          // this.getOnlyOrgsToShow(this.loggedUser?.organizations)
          this.organizationsToShow.map(c => this.loggedUser?.organizations.find(_ => _._id === c._id))
        // this.loggedUser?.organizations
          .filter(Boolean)
          // .filter(c => !organizationService.isOrgPending())
          .filter(c => c.status !== consts.organizationStatuses.pending)
          .filter(c => c._id != '-1')
          [0];
        if (!firstOrg) {
          // this.$router.push({ name: 'JoinOrgPage' });
          return;
        }
        this.$router.push({name: 'ReleasePage', params: {organizationId: firstOrg._id}});
      }
    },
    async loadSelectedOrg() {
      const id = this.selectedOrgId;
      if (!id || (id == '-1')) {
        // setDynamicStylingThemeEl({...allThemes[0], title: 'Megaphon'}, '.megaphon-app');
        // this.$store.commit({ type: 'setSelectedTheme', theme: allThemes[0], selector: '.megaphon-app' });  
        return;
      }
      // if (!id) return;
      const org = await this.$store.dispatch({ type: 'organization/loadItem', id, isToInheritData: true });
      if (org.redirectUrl) return window.open(org.redirectUrl, '_self');
    },
    
    createNewFolder(orgId, newFolderPath) {
      const orgToEdit = JSON.parse(JSON.stringify(this.organizations.find(c => c._id === orgId)));
      if (!orgToEdit.folders) orgToEdit.folders = [];
      const splitedFolderPath = newFolderPath.split('/').filter(Boolean);
      let currFolders = orgToEdit.folders;
      for (let currFoldName of splitedFolderPath) {
        let currFolder = currFolders.find(c => c?.name === currFoldName);
        if (!currFolder) {
          currFolder = { name: currFoldName, children: [], content: [] };
          currFolders.push(currFolder);
        }
        currFolders = currFolder.children;
      }
      orgToEdit.folders = orgToEdit.folders?.filter(Boolean) || [];
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
    },
    handleReleaseFilterChanged() {
      this.selectedReleaseIds = [];
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
    },

    '$router.path'() {
      this.selectedReleaseIds = [];
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .main-sidebar-view {
    @media (min-width: $small-screen-break) {
      padding-inline-start: 0;
    }
    >* {
      // padding: em(10px);
    }
  }
}
</style>
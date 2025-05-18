<template>
  <section class="release-page flex column height-all width-all flex gap20">
    <!-- <h2>{{$t('releaseLocales.releases')}}</h2> -->
    <div class="width-all" v-if="isUserWatchOnly">
      <ReleasesSlider
        :style="selectedTheme ? {
          '--clr-0': 'white' || selectedTheme.colors[1],
          '--clr-1': 'black' || selectedTheme.colors[0]
        } : {}"
        :localNav="false"
        :releases="allReleasesData.items"
        :getReleasePageRoute="(release => ({ name: 'ReleaseDetails', params: { id: release._id, organizationId: organizationId } }))"
      />
    </div>
    <ItemSearchList
      :itemsData="allReleasesData"
      :initFilterBy="filterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
      :showActions="false"
      :dontRoute="true"
      :propsToPass="{ selectedReleaseIds }"
      :isLoading="isLoading"
      :showLoader="false"
      layoutMode="grid"
    >
      <template v-slot:listHeader>
        <h2 v-if="selectedFolder">{{selectedFolder.name}}</h2>
      </template>
    </ItemSearchList>
    <Loader v-if="isLoading" fullScreen/>
    <router-view/>
  </section>
</template>

<script>
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import ReleasePreview from '../cmps/ReleasePreview.vue';
import ReleaseFilter from '../cmps/ReleaseFilter.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { organizationService } from '../../organization/services/organization.service';
import ReleasesSlider from '../../../../common/modules/release/cmps/ReleasesSlider.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';

export default {
  name: 'ReleasePage',
  props: {
    selectedReleaseIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      ReleasePreview,
      ReleaseFilter,
      currOrgFilter: null,
    }
  },
  methods: {
    getAllReleases(filterBy) {
      // if (!this.currOrgFilter) return;
      // this.$store.dispatch({ type: 'release/loadItems', filterBy, orgFilter: this.currOrgFilter || this.organization?.routes?.[0], folder: this.selectedFolder, organizationId: this.$route.params.organizationId });

      let routeName = this.pageNameInQuery;
      if (!routeName) {
        this.$router.push(this.firstPageRoute);
        routeName = this.pageNameInQuery;
        if (!routeName) return;
        // return;
      }
      let filterItem = this.organization?.routes.find(c => c.name === routeName) || this.allAuthRoutes?.[0] || undefined;
      if (this.noPageMode) filterItem = { releaseFilter: { releaseTpes: templateUtils.getAllReleaseTypesForOrg(org).map(c => c.id) } }
      if (!filterItem) return;
      if (!organizationService.isAccountAuthorizedToRoute(this.loggedUser, this.organization, filterItem.id)) return;
      this.$store.dispatch({ type: 'release/loadItems', filterBy, includeExpiredReleases: true, orgFilter: filterItem.releaseFilter, folder: this.selectedFolder, organizationId: this.$route.params.organizationId });
    },
    // handleOrgReleaseFilter(orgFilter) {
    //   this.$store.commit({ type: 'release/resetFilter' });
    //   this.currOrgFilter = orgFilter;
    //   this.getAllReleases();
    // },

    async handleFolderSelection(foldPath, folder) {
      this.$store.commit({ type: 'release/resetFilter' });
      this.getAllReleases();
    },

    initOrgPage() {
      const org = this.organization;
      if (!org) return;
      if (this.noPageMode) {
        this.getAllReleases(); 
        return;
      }
      if (!organizationService.isAccountAuthorizedToRoute(this.loggedUser, this.organization, this.pageNameInQuery)) {
        this.$router.push(this.firstPageRoute);
      } else {
        this.getAllReleases();        
      }
      // if (org.routes?.find(c => c.name === this.pageNameInQuery)) this.getAllReleases();
      // else this.$router.push({ query: { ...this.$route.query, page: org?.routes?.[0]?.name || '' } });
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    organizationId() {
      return this.$route.params.organizationId;
    },
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    allReleasesData() {
      return this.$store.getters['release/data'];
    },
    filterBy() {
      return this.$store.getters['release/filterBy'];
    },
    isLoading() {
      return this.$store.getters['release/isLoading'];
    },
    selectedFolder() {
      return this.$store.getters['organization/selectedFolder']
    },
    pageNameInQuery() {
      return this.$route.query.page;
    },
    isUserWatchOnly() {
      // return false
      // return true;
      // return this.$store.getters['auth/isWatchOnly'];
      return organizationService.isUserWatchOnly(this.organization?._id, this.loggedUser);
    },
    allAuthRoutes() {
      const allAuthRoutes = this.organization?.routes?.filter(c => organizationService.isAccountAuthorizedToRoute(this.loggedUser, this.organization, c.id)) || [];
      return allAuthRoutes;
    },
    noPageMode() {
      return this.$route.query.page == 0;
    },
    selectedTheme() {
      return this.$store.getters.selectedTheme;
    },
    firstPageRoute() {
      return { query: { ...this.$route.query, page: this.allAuthRoutes?.[0]?.name || '' } };
    },
  },
  created() {
    // this.getAllReleases(); // header emits filter when creates => loading releases;
    // evManager.on('org-release-filter', this.handleOrgReleaseFilter);
    this.initOrgPage();
    evManager.on('folder-selected', this.handleFolderSelection);
  },
  destroyed() {
    // evManager.off('org-release-filter', this.handleOrgReleaseFilter);
    evManager.off('folder-selected', this.handleFolderSelection);
  },
  watch: {
    organizationId(org) {
      // this.getAllReleases();
      // this.currOrgFilter = null
    },
    organization(org) {
      // if (this.pageNameInQuery) return;
      this.initOrgPage();
    },
    pageNameInQuery(val, prev) {
      // this.getAllReleases();
    },
    // '$route.path': {
    //   imidiate: true,
    //   handler() {
    //     this.initOrgPage();
    //   }
    // }
  },
  components: { ItemSearchList, Loader, ReleasePreview, ReleaseFilter, ReleasesSlider }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-page {
    // padding: em(10px);
    height: auto;
    .item-list {
      // justify-content: space-between !important;
      gap: em(20px);
    }
    .item-page {
      gap: 0;
      overflow: unset;
      .item-list {
        overflow-y: unset;
        
        .preview-container {
          // --btn-size: #{em(35px)};
          .release-preview {
            --btn-size: 18% !important;
          }
        }
        // @media (min-width: 1500px) {
        @media (min-width: 1175px) {
          grid-template-columns: 1fr 1fr 1fr 1fr 1fr !important;
          .preview-container {
            // --btn-size: #{em(35px)};
            // .release-preview {
            //   --btn-size: 18% !important;
            // }
            img, .actions-container {
              width: 100%;
              height: unset;
              flex: 1;
              aspect-ratio: 3 / 2;
            }
            .release-title {
              
              // font-size: 0.2% !important;
              
            }
          }
        }
        .release-preview {
          // --height: #{em(200px)} !important;
          // --height: 80% !important;
          // @media (max-width: 1500px) {
          //   --height: #{em(160px)} !important;
          //   --btn-size: #{em(28px)};
          // }
        }
        @media (max-width: 1500px) {
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
        }
        @media (max-width: $small-screen-break) {
          grid-template-columns: 1fr;
          // justify-content: space-around !important;
          flex-direction: column;
          align-items: center;
        }
        margin-bottom: em(20px);
      }
    }
    
    .releases-slider {
      // --clr-0: var(--clr-1);
      // --clr-1: var(--clr-0);
      .arrow-btn {
        // height: em(50px);
        // position: absolute;
        // background-color: unset;
        // border-radius: unset;
        // box-shadow: $light-shadow;
        .img {
          // background-image: url('~@/apps/megaphonApp/assets/images/icons/right_slider_arrow_white.svg');
        }
        &.plus {
          // right: em(10px);
          // transform: unset;
        }
        &.minus {
          // left: em(10px);
          // transform: rotate(180deg);
        }
      }
      // color: var(--clr-1);
      .hero-main {
        padding: 0;
        img {
          height: em(500px);
          flex: 3;
        }
        // background-color: var(--clr-0);
        .hero-content {
          height: em(350px);
          flex: 2;
          // background-color: var(--clr-0);
          // color: var(--clr-1);
          // * {
          //   background: unset !important;
          //   background-color: unset !important;
          // }
          padding-inline-end: em(50px);
        }
        @media (max-width: $small-screen-break) {
          padding: 0 !important;
          img {
            height: em(250px);
          }
          .hero-content {
            padding: em(5px) em(50px);
          }
        }
      }
    }
  }
}
</style>
<template>
  <header class="app-header flex align-center">
    <div class="container header-content width-all flex align-center space-between">
      <div>
        <div class="org-logo">
          <!-- <div class="actual flex column align-center gap10">
            <h1>אגם</h1>
            <p class="sub">הוצאה לאור</p>
          </div> -->
          <img class="actual" :src="fixFileSrcToThumbnail(org.logo, org)" :alt="org.name">
        </div>
      </div>

      <!-- <button @click="mobileShow = !mobileShow" class="nav-burger">☰</button> -->
      <NavOrBurger :showBurger="!!allRouteFilters.length">
        <CostumeNavBar class="nav-items"/>
      </NavOrBurger>
    </div>
  </header>
</template>

<script>
import CostumeNavBar from '../../../common/modules/common/cmps/CostumeNavBar.vue';
import NavOrBurger from '../../../common/modules/common/cmps/NavOrBurger.vue';
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';
export default {
  components: { NavOrBurger, CostumeNavBar },
  name: 'default_AppHeader',
  computed: {
    // initReleaseId() {
    //   return this.$store.getters['release/initReleaseId'];
    // },
    showOnlyreleases() {
      return this.$route.query?.releasesView === 'true';
    },

    mainTo() {
      return { name: 'ReleasePage' };
      // return this.$store.getters.mainLinkRouteTo;
      // return this.initReleaseId
      //   ? {name: 'ReleaseDetails', params: {id: this.initReleaseId} }
      //   : { name: 'ReleasePage' }
    },

    org () {
      return this.$store.getters['organization/selectedItem'] || {};
    },
    allRouteFilters() {
      return this.org?.routes?.filter(c => c.showInRoles?.includes('client')) || [];
    },

    // release() {
    //   return this.$store.getters['release/selectedItem'];
    // },
    // releaseTitle() {
    //   if (!this.release?.releaseData?.publishedAt) return this.release?.releaseData?.title || '';
    //   const at = new Date(this.release.releaseData.publishedAt);
    //   const month = at.getMonth() + 1;
    //   const year = at.getFullYear();
    //   if (isNaN(month) || isNaN(year)) return this.release.releaseData.title;
    //   const pretyMont = this.$t('months.'+month);
    //   return `${pretyMont} ${year}`;
    // }
  },
  methods: {
    toggleMainView() {
      const newVal = this.$route.query.releasesView ? !(this.$route.query.releasesView === 'true') + '' : 'false';
      this.$router.push({ ...this.mainTo, query: { ...this.$route.query, releasesView: newVal } });
    },
    fixFileSrcToThumbnail
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '@/assets/styles/themes/index';
.defaultApp {
  .app-header {
    font-weight: 600;
    // background-color: $layout-black;
    // position: relative;

    box-shadow: $light-shadow;
  
    .header-content {
      position: relative;
    }
    
  
    .media-list {
      img {
        width: 35px;
        height: 35px
      }
    }
  
    .org-logo {
      // width: 60px;
      height: $header-height;
      .actual {
        height: 100%;
      }
    }
    
  }
}
</style>
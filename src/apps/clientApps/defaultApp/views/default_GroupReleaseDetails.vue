<template>
  <section class="group-release-details flex column gap30 height-all">
    <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${release.mainImage.src}')`, 'background-size': 'cover' }">
      <ReleasesSlider :releases="release.childrenReleases"/>
    </section>
    <div class="inner-container flex column gap30">
      <h1>{{release.title}}</h1>
      <h5>{{release.subTitle}}</h5>
      <p v-if="monthPublish">{{$t('release.monthPublish')}}: {{monthPublish}}</p>
      <div v-html="release.content"></div>
      <ItemList
        class="flex-1"
        :items="release.childrenReleases"
        itemDetailesPageName="ReleaseDetails"
        :singlePreviewCmp="ReleasePreview"
      />
      <FilesSection :release="release"/>
    </div>
  </section>
</template>

<script>
import ItemList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemList.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue'
import ReleasePreview from '../cmps/default_ReleasePreview.vue'
import FilesSection from '@/apps/common/modules/release/cmps/FilesSection.vue'
import ReleasesSlider from '../../../common/modules/release/cmps/ReleasesSlider.vue'

export default {
  name: 'default_GroupReleaseDetails',
  components: { ItemList, ReleasePreview, ItemSearchList, FilesSection, ReleasesSlider },
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  data() {
    return { 
      ReleasePreview
    }
  },
  computed: {
    allReleasesData() {
      return this.$store.getters['release/data'];
    },
    allReleasesFilterBy() {
      return this.$store.getters['release/filterBy'];
    },
    orgId() {
      return this.$store.getters['release/organizationId'];
    },
    showOnlyreleases() {
      return this.$route.query?.releasesView === 'true';
    },
    monthPublish() {
      if (!this.release.publishedAt) return '';
      const at = new Date(this.release.publishedAt);
      const month = at.getMonth() + 1;
      const year = at.getFullYear();
      if (isNaN(year)) return '';
      const pretyMont = this.$t('months.'+month);
      return `${pretyMont} ${year}`;
    },
  },
  methods: {

    // getAllReleases(filterBy) {
    //   if (!this.orgId) return;
    //   this.$store.dispatch({ type: 'release/loadItems', filterBy });
    // }
  },
  // watch: {
  //   orgId() {
  //     this.getAllReleases();
  //   }
  // }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
@import '../assets/style/index';
.defaultApp {
  .group-release-details {
    padding-bottom: $main-pad-y;
  
    .release-hero-view {
      background-color: rgb(255, 255, 255);
      padding: em(30px);
      // .hero {
      //   position: relative;
      //   width: 60%;
      //   @media (max-width: 1700px) {
      //     width: 90%;
      //   }
      //   min-height: 400px;
      //   .hero-main {
      //     background: white;
      //     flex: 1;
      //     padding: em(40px);
      //     height: 100%;
      //     margin: unset;
          
      //     .main-img {
      //       height: 100%;
      //       max-height: 300px;
      //       width: 35%;
      //       object-fit: contain;
      //       background-color: rgb(255, 216, 216);
      //     }
  
      //     hr {
      //       width: 70px;
      //       height: 1px;
      //       align-self: flex-start;
      //       margin: 0;
      //       // background-color: $main-font-color;
      //       border: 0;
      //     }
  
      //     button {
      //       border-radius: 20px;
      //       img {
      //         height: 12px;
      //         width: 12px;
      //       }
      //     }

      //   }
      // }
    }
  
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }

    
    @media (max-width: $small-screen-breake) {
      .hero {
        gap: em(5px);
        width: 98% !important;
        
      }
      .hero-main {
        flex: 1;
        flex-wrap: wrap;
        padding: em(15px) !important;
      }
      .arrow-btn {
        width: em(100px);
        height: em(100px);
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .release-hero-view {
        padding: em(5px);
        width: 100%;
      }
    }

  }
}
</style>
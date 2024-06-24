<template>
  <section class="group-release-details flex column gap30 height-all">
    <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${release.mainImage.src}')`, 'background-size': 'cover' }">
      <ReleasesSlider class="inner-container" :releases="release.childrenReleases"/>
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
import ReleasePreview from '../cmps/common_ReleasePreview.vue'
import ReleaseFilter from '../cmps/common_ReleaseFilter.vue'
import FilesSection from '../cmps/FilesSection.vue'
import ReleasesSlider from '../cmps/ReleasesSlider.vue'

export default {
  name: 'common_GroupReleaseDetails',
  components: { ItemList, ReleasePreview, ItemSearchList, ReleaseFilter, FilesSection, ReleasesSlider },
  props: {
    release: {
      type: Object,
      required: true
    }
  },
  data() {
    return { 
      ReleasePreview,
      ReleaseFilter,
      viewdChildIdx: 0
    }
  },
  computed: {
    viewdChild() {
      const res = this.release.childrenReleases[this.viewdChildIdx] || null;
      if (!res) return null;
      return {...res.releaseData, _id: res._id};
    },

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
    shiftChild(diff) {
      const max = this.release.childrenReleases.length - 1;
      let newIdx = this.viewdChildIdx + diff;
      if (newIdx < 0) newIdx = max;
      else if (newIdx > max) newIdx = 0;
      this.viewdChildIdx = newIdx;
    },

    getAllReleases(filterBy) {
      if (!this.orgId) return;
      this.$store.dispatch({ type: 'release/loadItems', filterBy });
    }
  },
  watch: {
    orgId() {
      this.getAllReleases();
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// @import '../../../assets/style/index';
.default-app {
  .group-release-details {
    padding-bottom: $main-pad-y;
  
    .release-hero-view {
      background-color: rgb(255, 255, 255);
      padding: em(30px);
      .releases-slider {
        width: 60%;
        @media (max-width: 1700px) {
          width: 90%;
        }
        @media (max-width: $small-screen-breake) {
          width: 98% !important;
        }
      }
    }
  
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }

    
    @media (max-width: $small-screen-breake) {
      .release-hero-view {
        padding: em(0px);
        width: 100%;
      }
      .releases-slider {
        margin-bottom: em(10px);
      }
    }

  }
}
</style>
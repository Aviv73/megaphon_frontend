<template>
  <section class="group-release-details flex column gap30 height-all">
    <section class="release-hero-view flex align-center justify-center gap10" :style="{background: `url('${release.mainImage.src}')`, 'background-size': 'cover' }">
      <div class="hero flex align-center justify-center gap30">
        <button class="arrow-btn" @click="shiftChild(1)">
          <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'" style="transform:rotate(180deg)">
        </button>
        <div v-if="viewdChild" class="">
          <div class="hero-main inner-container flex gap30 width-all">
            <img class="main-img" :src="viewdChild.mainImage.src" :alt="viewdChild.title"/>
            <div class="hero-content flex column align-start gap20">
              <h2>{{viewdChild.title}}</h2>
              <div v-html="viewdChild.content"></div>
              <hr/>
              <router-link :to="{ params: {id: viewdChild._id} }">
                <button class="flex align-center gap5">
                  <span>
                    לפרטים 
                  </span>
                </button>
              </router-link>
            </div>
          </div>
        </div>
        <button class="arrow-btn" @click="shiftChild(-1)">
          <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'">
        </button>
      </div>
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
import ReleaseFilter from '../cmps/default_ReleaseFilter.vue'
import FilesSection from '../cmps/FilesSection.vue'

export default {
  name: 'default_GroupReleaseDetails',
  components: { ItemList, ReleasePreview, ItemSearchList, ReleaseFilter, FilesSection },
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
@import '../../../assets/style/index';
.default-app {
  .group-release-details {
    padding-bottom: $main-pad-y;
  
    .release-hero-view {
      background-color: rgb(255, 255, 255);
      padding: em(30px);
      .hero {
        position: relative;
        width: 60%;
        @media (max-width: 1700px) {
          width: 90%;
        }
        min-height: 400px;
        .hero-main {
          background: white;
          flex: 1;
          padding: em(40px);
          height: 100%;
          margin: unset;
          
          .main-img {
            height: 100%;
            max-height: 300px;
            width: 35%;
            object-fit: contain;
            background-color: rgb(255, 216, 216);
          }
  
          hr {
            width: 70px;
            height: 1px;
            align-self: flex-start;
            margin: 0;
            // background-color: $main-font-color;
            border: 0;
          }
  
          button {
            border-radius: 20px;
            img {
              height: 12px;
              width: 12px;
            }
          }

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
        width: 100px;
        height: 100px;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .release-hero-view {
        padding: em(0px);
        width: 100%;
      }
    }

  }
}
</style>
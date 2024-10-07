<template>
  <section class="monthly-release-details flex column gap30 height-all">
    <section class="release-hero-view flex align-center justify-center gap10">
      <div class="hero flex align-center justify-center gap30">
        <button class="arrow-btn" @click="shiftChild(1)">
          <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'" style="transform:rotate(180deg)">
        </button>
        <div v-if="viewdChildData" class="">
          <div class="hero-main inner-container flex gap30 width-all">
            <img class="main-img" :src="fixFileSrcToThumbnail(viewdChildData.mainImage, viewdChild)" :alt="viewdChildData.title"/>
            <div class="hero-content flex column align-start gap20">
              <h2>{{viewdChildData.title}}</h2>
              <p>{{$t('release.by')}}: {{viewdChildData.author}}</p>
              <div v-html="viewdChildData.content"></div>
              <hr/>
              <router-link :to="{ params: {id: viewdChildData._id} }">
                <button class="flex align-center gap5">
                  <span>
                    לפרטים 
                  </span>
                  <img :src="require('@/apps/clientApps/agam/assets/images/small-arrow-white.png')" alt="➜"/>
                </button>
              </router-link>
            </div>
          </div>
          <div class="hero-footer"></div>
        </div>
        <button class="arrow-btn" @click="shiftChild(-1)">
          <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'">
        </button>
      </div>
    </section>
    <div class="inner-container flex column gap30">
      <h1>{{releaseData.title}}</h1>
      <div v-html="releaseData.content"></div>
      <ItemList
        layoutMode="flex"
        class="flex-1"
        :items="releaseData.childrenReleases"
        itemDetailesPageName="ReleaseDetails"
        :singlePreviewCmp="ReleasePreview"
      />
    </div>
    <!-- <ItemSearchList
      class="inner-container"
      :itemsData="allReleasesData"
      :initFilterBy="allReleasesFilterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
      :dontRoute="true"
    /> -->
    <!-- <ul>
      <li v-for="child in release.childrenReleases" :key="child.id">
        <router-link :to="{ params: {id: child._id} }">
          <img :src="child.releaseData.mainImage" :alt="child.releaseData.title">
          <p>{{child.releaseData.title}}</p>
        </router-link>
      </li>
    </ul> -->
  </section>
</template>

<script>
import ItemList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemList.vue'
import ItemSearchList from '@/apps/common/modules/common/cmps/ItemSearchList/ItemSearchList.vue'
import ReleasePreview from '../cmps/agam_ReleasePreview.vue'
import ReleaseFilter from '../cmps/agam_ReleaseFilter.vue'
import { fixFileSrcToThumbnail } from '@/apps/common/modules/common/services/file.service';

export default {
  name: 'agam_MonthlyReleaseDetails',
  components: { ItemList, ReleasePreview, ItemSearchList, ReleaseFilter },
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
      const res = this.releaseData.childrenReleases[this.viewdChildIdx] || null;
      return res;
    },
    viewdChildData() {
      if (!this.viewdChild) return null;
      return {...this.viewdChild.releaseData, _id: this.viewdChild._id};
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
    releaseData() {
      return this.release.releaseData;
    },
  },
  methods: {
    shiftChild(diff) {
      const max = this.releaseData.childrenReleases.length - 1;
      let newIdx = this.viewdChildIdx + diff;
      if (newIdx < 0) newIdx = max;
      else if (newIdx > max) newIdx = 0;
      this.viewdChildIdx = newIdx;
    },

    getAllReleases(filterBy) {
      if (!this.orgId) return;
      this.$store.dispatch({ type: 'release/loadItems', filterBy });
    },
    fixFileSrcToThumbnail
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
@import '../assets/style/index';
.agam-app {
  .monthly-release-details {
    padding-bottom: $main-pad-y;
  
    .release-hero-view {
      background-color: rgb(255, 216, 216);
      background: url('~@/apps/clientApps/agam/assets/images/bookshelf_background.jpg') fixed;
      padding: em(30px);
      .hero {
        position: relative;
        // .arrow-btn {
        //   position: absolute;
        //   top: 50%;;
        //   right: em(-60px);
        //   &:last-child {
        //     right: unset;
        //     left: em(-60px);
        //   }
        // }
        width: 60%;
        @media (max-width: 1700px) {
          width: 90%;
        }
        // height: 400px;
        // overflow-y: auto;
        // overflow-x: hidden;
        min-height: 400px;
        // height: 400px;
        .hero-main {
          background: white;
          flex: 1;
          padding: em(40px);
          height: 100%;
          margin: unset;
          
          .main-img {
            height: 100%;
            max-height: 300px;
            // width: auto;
            width: 35%;
            object-fit: contain;
            background-color: rgb(255, 216, 216);
            // flex: 1;
          }
          .hero-content {
            // flex: 3;
          }
  
          hr {
            width: 70px;
            height: 1px;
            align-self: flex-start;
            margin: 0;
            background-color: $main-font-color;
            border: 0;
          }
  
          button {
            padding: 6px 25px;
            border-radius: 20px;
            background-color: $layout-red;
            color: $light-white;
            img {
              height: 12px;
              width: 12px;
            }
          }

        }
        .hero-footer {
          height: 15px;
          background: linear-gradient(90deg, $layout-black 80%, $layout-red 20%);
        }
      }
    }
  
    .item-page {
      overflow: unset;
      .item-list {
        overflow-y: unset;
      }
    }

    
    @media (max-width: $small-screen-break) {
      .hero {
        // gap: em(10px);
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
        // z-index: 10;
        // position: relative;
        // position: absolute;
        // top: 50%;
        // right: 0;
        // transform: translateY(-50%);
        // right: unset;
        // left: unset;
        // position: unset !important;
      }

      .release-hero-view {
        // padding: em(10px);
        padding: em(0px);
        width: 100%;
      }
    }

  }
}
</style>
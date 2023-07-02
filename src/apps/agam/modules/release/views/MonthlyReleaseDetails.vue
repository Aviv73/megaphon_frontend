<template>
  <section class="monthly-release-details flex column gap30 height-all">
    <section class="release-hero-view flex align-center justify-center gap10">
      <div class="hero flex column inner-container">
        <button class="arrow-btn" @click="shiftChild(1)" :src="require('@/apps/agam/assets/images/pageArrow.svg')">
          <img :src="require('@/apps/agam/assets/images/pageArrow.svg')" :alt="'>'" style="transform:rotate(180deg)">
        </button>
        <div v-if="viewdChild" class="hero-main flex-1 flex gap30">
          <img class="main-img" :src="viewdChild.mainImage[0].src" :alt="viewdChild.title"/>
          <div class="hero-content flex column align-start gap20">
            <h2>{{viewdChild.title}}</h2>
            <p>{{$t('release.by')}}: {{viewdChild.author}}</p>
            <div v-html="viewdChild.desc"></div>
            <hr/>
            <router-link :to="{ params: {id: viewdChild._id} }">
              <button class="flex align-center gap5">
                <span>
                  לפרטים 
                </span>
                <img :src="require('@/apps/agam/assets/images/small-arrow-white.png')" alt="➜"/>
              </button>
            </router-link>
          </div>
        </div>
        <div class="hero-footer"></div>
        <button class="arrow-btn" @click="shiftChild(-1)" :src="require('@/apps/agam/assets/images/pageArrow.svg')">
          <img :src="require('@/apps/agam/assets/images/pageArrow.svg')" :alt="'>'">
        </button>
      </div>
    </section>
    <div class="inner-container flex column gap30">
      <h1>{{release.title}}</h1>
      <ItemList
        class="flex-1"
        :items="release.childrenReleases"
        itemDetailesPageName="ReleaseDetails"
        :singlePreviewCmp="ReleasePreview"
      />
    </div>
    <ItemSearchList
      class="inner-container"
      :itemsData="allReleasesData"
      :initFilterBy="allReleasesFilterBy"
      @filter="getAllReleases"
      itemDetailesPageName="ReleaseDetails"
      :singlePreviewCmp="ReleasePreview"
      :filterByCmp="ReleaseFilter"
    />
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
import ReleasePreview from '../cmps/ReleasePreview.vue'
import ReleaseFilter from '../cmps/ReleaseFilter.vue'

export default {
  name: 'MonthlyReleaseDetails',
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
    }
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
.monthly-release-details {
  padding-bottom: $main-pad-y;

  .release-hero-view {
    background-color: rgb(255, 216, 216);
    background: url('~@/apps/agam/assets/images/bookshelf_background.jpg') fixed;
    padding: 30px;
    .hero {
      position: relative;
      .arrow-btn {
        position: absolute;
        top: 50%;;
        right: -60px;
        &:last-child {
          right: unset;
          left: -60px;
        }
      }
      width: 60%;
      @media (max-width: 1700px) {
        width: 90%;
      }
      // height: 400px;
      // overflow-y: auto;
      // overflow-x: hidden;
      min-height: 400px;
      // height: 400px;
      background: white;
      .hero-main {
        flex: 1;
        padding: 40px;
        height: 100%;
        
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
}
</style>
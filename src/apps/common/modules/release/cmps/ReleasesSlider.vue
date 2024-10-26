<template>
  <div class="releases-slider flex align-center justify-center gap15">
    <button v-if="viewMoveBtns" class="arrow-btn plus" @click="shiftChild(-1)">
      <!-- <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'" style="transform:rotate(180deg)"> -->
      <div class="img svg-parrent" v-html="sliderBtnImg"></div>
    </button>
    <div v-if="viewdChildData" class="hero-main flex-1 flex gap30 width-all align-center">
      <img class="main-img hero-img" :src="imgToRender" :alt="viewdChildData.title"/>
      <div class="hero-content flex column align-start gap20">
        <div v-if="title" class="costume-title" v-html="title"></div>
        <h2>{{viewdChildData.title}}</h2>
        <div class="content-container pretty-scroll flex column align-start gap20">
          <div v-html="viewdChildData.content || viewdChildData.desc"></div>
        </div>
        <hr/>
        <!-- <router-link :to="routeToPage"> -->
          <button @click="routeToPage" class="flex align-center gap5 to-details-btn">
            <span>
              {{$t('toDetails')}} 
            </span>
          </button>
        <!-- </router-link> -->
      </div>
    </div>
    <button v-if="viewMoveBtns" class="arrow-btn minus" @click="shiftChild(1)">
      <!-- <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'"> -->
      <div class="img svg-parrent" v-html="sliderBtnImg"></div>
    </button>
  </div>
</template>

<script>
import config from '@/config';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import { fixFileSrcToThumbnail } from '../../common/services/file.service';
import  { getSvgs } from '@/assets/images/svgs.js';
export default {
  name: 'ReleasesSlider',
  props: {
    releases: {
      type: Array,
      default: []
    },
    getReleasePageRoute: {
      type: Function,
      default: undefined
    },
    title: {
      type: String,
      required: false
    },
    localNav: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data() {
    return { 
      viewdChildIdx: 0
    }
  },
  methods: {
    shiftChild(diff) {
      const max = this.releases.length - 1;
      let newIdx = this.viewdChildIdx + diff;
      if (newIdx < 0) newIdx = max;
      else if (newIdx > max) newIdx = 0;
      this.viewdChildIdx = newIdx;
    },

    routeToPage() {
      if (this.localNav) this.$router.push(
        this.getReleasePageRoute ? this.getReleasePageRoute(this.viewdChild) : { name: 'ReleaseDetails', params: {id: this.viewdChildData._id} }
      );
      else window.open(
        templateUtils.getReleaseLandingPageUrl(this.viewdChild, this.organization, 'landingPage', config)
      );
    },
  },
  computed: {
    viewdChild() {
      const res = this.releases[this.viewdChildIdx] || null;
      return res;
    },
    viewdChildData() {
      if (!this.viewdChild) return null;
      return {...this.viewdChild.releaseData, _id: this.viewdChild._id};
    },

    imgToRender() {
      return fixFileSrcToThumbnail(this.viewdChildData?.mainImage, this.viewdChild);
    },

    viewMoveBtns() {
      return !!(this.releases?.length > 1);
    },

    organization() {
      return this.$store.getters['organization/selectedItem'];
    },

    sliderBtnImg() {
      // const theme = this.$store.getters.selectedTheme;
      // const clr = theme?.colors?.[0] || 'black';
      return getSvgs('var(--clr-0)').sliderBtn; 
    }
  },
  watch: {
    releases() {
      this.viewdChildIdx = 0;
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.releases-slider {
  max-width: 100%;
  position: relative;
  // background-color: var(--clr-1);
  // color: var(--clr-0);
  // width: 60%;
  // @media (max-width: 1700px) {
  //   width: 90%;
  // }
  // min-height: 400px;
  .hero-main {
    box-shadow: $light-shadow;
    // background: black;
    color: var(--clr-0);
    background-color: var(--clr-1);
    flex: 1;
    padding: em(40px);
    height: 100%;
    margin: unset;

    .main-img, .hero-content {
      height: em(250px);
    }
    
    .main-img {
      // height: 100%;
      // max-height: 300px;
      width: 35%;
      // object-fit: contain;
      // background-color: rgb(255, 216, 216);
    }

    .content-container {
      // height: em(200px);
      flex: 1;
      overflow-y: auto;
      padding-inline-end: em(10px);
      word-break: break-word;
      line-height: 1.2em;
      * {
        background-color: unset !important;
        background: unset !important;
        // color: var(--clr-1);
        // color: var(--clr-1);
      }
    }

    hr {
      width: em(70px);
      height: em(1px);
      align-self: flex-start;
      margin: 0;
      // background-color: $main-font-color;
      border: 0;
    }


    button {
      border-radius: em(20px);
      img {
        height: em(12px);
        width: em(12px);
      }
    }

  }
  
  .arrow-btn {
    width: em(30px);
    height: em(50px);
    // height: em(30px);
    // background-color: hsla(0, 0%, 0%, 0.25);
    // border-radius: 50%;
    // box-shadow: $light-shadow;
    overflow: hidden;
    position: absolute;
    .img {
      width: 100%;
      height: 100%;
      // img {
      //   height: 100%;
      //   width: 100%;
      // }
      // background: url('~@/apps/megaphonApp/assets/images/icons/right_slider_arrow_black.svg') no-repeat center / contain;
      // background: url('~@/apps/clientApps/agam/assets/images/pageArrow.svg') no-repeat center / contain;
      // background-size: 100%;
    }
    &.plus {
      right: em(5px);
      // transform: rotate(180deg);
    }
    &.minus {
      left: em(5px);
      transform: rotate(180deg);
    }
    // img {
    //   width: 100%;
    //   height: 100%;
    //   object-fit: contain;
    // }
  }

  @media (max-width: $small-screen-break) {
    gap: em(5px);
    // width: 98% !important;
    .hero-main {
      flex: 1;
      flex-wrap: wrap;
      padding: em(15px) !important;
      .main-img {
        height: em(200px);
        width: 100%;
        // max-width: em(200px);
      }
    }
    .arrow-btn {
      width: em(30px);
      height: em(30px);

      // img {
      //   width: 100%;
      //   height: 100%;
      //   object-fit: contain;
      // }
    }
  }
}
</style>
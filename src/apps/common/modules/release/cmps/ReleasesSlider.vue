<template>
  <div class="releases-slider flex align-center justify-center gap15">
    <button class="arrow-btn" @click="shiftChild(1)">
      <img :src="require('@/apps/clientApps/agam/assets/images/pageArrow.svg')" :alt="'>'" style="transform:rotate(180deg)">
    </button>
    <div v-if="viewdChild" class="flex-1">
      <div class="hero-main flex gap30 width-all">
        <img class="main-img" :src="imgToRender" :alt="viewdChild.title"/>
        <div class="hero-content flex column align-start gap20">
          <div class="content-container flex column align-start gap20">
            <h2>{{viewdChild.title}}</h2>
            <div v-html="viewdChild.content || viewdChild.desc"></div>
          </div>
          <hr/>
          <router-link :to="routeToPage">
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
</template>

<script>
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
    }
  },
  computed: {
    viewdChild() {
      const res = this.releases[this.viewdChildIdx] || null;
      if (!res) return null;
      return {...res.releaseData, _id: res._id};
    },

    imgToRender() {
      return this.viewdChild?.mainImage?.src || this.viewdChild?.mainImage?.[0]?.src;
    },

    routeToPage() {
      return this.getReleasePageRoute ? this.getReleasePageRoute(this.viewdChild) : { params: {id: this.viewdChild._id} };
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
  // width: 60%;
  // @media (max-width: 1700px) {
  //   width: 90%;
  // }
  // min-height: 400px;
  .hero-main {
    box-shadow: $light-shadow;
    background: white;
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
      height: em(200px);
      overflow-y: auto;
      word-break: break-word;
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
    height: em(30px);
    background-color: hsla(0, 0%, 0%, 0.25);
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  @media (max-width: $small-screen-breake) {
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
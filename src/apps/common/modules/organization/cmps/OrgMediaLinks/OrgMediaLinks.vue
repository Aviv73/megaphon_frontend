<template>
  <ul class="organization-media-links flex align-center gap10 wrap">
    <li v-for="link in mediaLinks" :key="link.id">
      <a :href="link.src" target="_blank" class="hover-pop">
        <!-- <img :src="require(`@/assets/images/media/${link.type}.svg`)" alt=""> -->
        <div class="img svg-parrent" v-html="mediaSvgs[link.type]"></div>
      </a>
    </li>
  </ul>
</template>

<script>
import  { getSvgs } from '../../../../../../assets/images/svgs.js';
export default {
  name: 'OrgMediaLinks',
  props: {
    organization: Object,
    color: String,
    imgs: Object
  },
  computed: {
    mediaLinks() {
      return this.organization?.mediaLinks?.filter(c => c.src && c.type) || [];
    },
    mediaSvgs() {
      return this.imgs || getSvgs(this.color).media;
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.organization-media-links {
  li {
    width: fit-content;
    height: fit-content;
    display: inline-flex;
  }
  a {
    display: inline-block;
    width: em(30px);
    height: em(30px);
    img, .img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
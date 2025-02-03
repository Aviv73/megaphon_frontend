<template>
  <div class="txt-cliper">
    <p class="txt" :title="title">
      <span v-if="titleTxt" class="txt-title">{{titleTxt}}</span>
      {{txtToShow}}
      <button v-if="needsToggle" @click="toggle()" class="read-more-btn">
        {{!toggled? 'Read more' : 'Read less'}}
      </button>
    </p>
    <p class="full-txt" :title="title">
      <span v-if="titleTxt" class="txt-title">{{titleTxt}}</span>
      {{txt}}
    </p>
  </div>
</template>

<script>
import { cropText } from '@/apps/common/modules/common/services/util.service';
export default {
  name: 'ClipTxt',
  props: {
    txt: String,
    titleTxt: String,
    maxLength: {
      type: Number,
      default: () => 100
    }
  },
  data() {
    return {
      toggled: false
    }
  },
  computed: {
    needsToggle() {
      return (this.txt.length + (this.titleTxt?.length || 0)) > this.maxLength;
    },
    txtToShow() {
      if (this.toggled) return this.txt;
      return cropText(this.txt, this.maxLength - (this.titleTxt?.length || 0));
    },
    title() {
      return [this.titleTxt, this.txt].filter(Boolean).join(' ');
    }
  },
  methods: {
    toggle(val) {
      if (typeof val === 'boolean') this.toggled = val;
      else this.toggled = !this.toggled;
    }
  }
}
</script>

<style lang="scss">
.txt-cliper {
  .full-txt {
    display: none;
  }
  .txt-title {
    text-decoration: underline;
  }
}
</style>
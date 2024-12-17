<template>
  <div class="txt-cliper">
    <p class="txt">
      {{txtToShow}}
      <button v-if="needsToggle" @click="toggle()" class="read-more-btn">
        {{!toggled? 'Read more' : 'Read less'}}
      </button>
    </p>
    <p class="full-txt">{{txt}}</p>
  </div>
</template>

<script>
import { cropText } from '@/cms/services/util.service';
export default {
  name: 'ClipTxt',
  props: {
    txt: String,
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
      return this.txt.length > this.maxLength;
    },
    txtToShow() {
      if (this.toggled) return this.txt;
      return cropText(this.txt, this.maxLength);
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
.clip-txt {
  .full-txt {
    display: none;
  }
}
</style>
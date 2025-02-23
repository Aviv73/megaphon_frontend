<template>
  <div class="table-action-btns flex gap10 align-center">
    <button class="btn clear delete-btn" :disabled="!allowEmptyArray && (value.length <= 1)" @click.stop.prevent="spliceFromVal"><div v-html="svgs.x" class="svg-parrent"></div></button>
    <button class="btn clear" :disabled="!idx" @click.stop.prevent="updateIdx(-1)"><div v-html="svgs.triangleUp" class="svg-parrent"></div></button>
    <button class="btn clear" :disabled="idx >= value.length-1" @click.stop.prevent="updateIdx(1)"><div v-html="svgs.triangleUp" class="svg-parrent down-arrow"></div></button>
    <!-- <button class="btn clear" :disabled="!idx" @click.stop.prevent="updateIdx(-1)"><span class="delete-mini-btn ↑">↑</span></button>
    <button class="btn clear" :disabled="idx >= value.length-1" @click.stop.prevent="updateIdx(1)"><span class="delete-mini-btn ↓">↓</span></button> -->
  </div>
</template>

<script>
import { getSvgs } from '@/assets/images/svgs';
export default {
  name: 'TableActionBtns',
  props: {
    value: [Array],
    idx: [Number],
    allowEmptyArray: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    spliceFromVal() {
      const newVal = [...this.value];
      newVal.splice(this.idx, 1);
      this.$emit('input', newVal);
      return newVal;
    },
    updateIdx(diff) {
      const newIdx = this.idx + diff;
      if (newIdx < 0 || newIdx > (this.value.length-1)) return;
      const newVal = [...this.value];
      const item = newVal.splice(this.idx, 1)[0];
      newVal.splice(newIdx, 0, item);
      this.$emit('input', newVal);
    }
  },
  computed: {
    svgs() {
      return getSvgs();
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme { // moved to;
//   .table-action-btns {
//     .delete-mini-btn {
//       background-color: #fff;
//       border-radius: 50%;
//       padding: em(1px);
//     }
//   }
// }
.table-action-btns {
  // .delete-mini-btn {
  //   color: var(--clr-0);
  //   font-size: em(16px);
  //   font-weight: bold;
  //   display: inline-block;
  //   width: em(15px);
  //   height: em(15px);
  //   object-fit: unset;
  // }
  .down-arrow {
    transform: rotate(180deg);
  }
  color: var(--clr-0);
  .delete-btn {
    color: #D03161;
  }
}
</style>
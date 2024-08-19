<template>
  <div class="table-action-btns flex gap10 align-center">
    <button class="btn clear" :disabled="!allowEmptyArray && (value.length <= 1)" @click.stop.prevent="spliceFromVal"><img class="delete-mini-btn" :src="require('@/assets/images/icons/delete_red.svg')"/></button>
    <!-- <button class="btn clear" :disabled="!idx" @click.stop.prevent="updateIdx(-1)"><img class="delete-mini-btn" :src="require('@/assets/images/icons/arrow-up.png')"/></button>
    <button class="btn clear" :disabled="idx >= value.length-1" @click.stop.prevent="updateIdx(1)"><img class="delete-mini-btn" :src="require('@/assets/images/icons/arrow-down.png')"/></button> -->
    <button class="btn clear" :disabled="!idx" @click.stop.prevent="updateIdx(-1)"><span class="delete-mini-btn ↑">↑</span></button> <!--  -->
    <button class="btn clear" :disabled="idx >= value.length-1" @click.stop.prevent="updateIdx(1)"><span class="delete-mini-btn ↓">↓</span></button>
  </div>
</template>

<script>
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
  .delete-mini-btn {
    color: var(--clr-0);
    font-size: em(16px);
    font-weight: bold;
    display: inline-block;
    width: em(15px);
    height: em(15px);
    object-fit: unset;
  }
}
</style>
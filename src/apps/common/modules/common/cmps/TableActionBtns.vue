<template>
  <div class="table-action-btns flex gap10 align-center">
    <button class="btn clear" :disabled="value.length <= 1" @click="spliceFromVal"><img class="delete-mini-btn" :src="require('@/apps/megaphonApp/assets/images/delete_red.svg')"/></button>
    <button class="btn clear" :disabled="!idx" @click="updateIdx(-1)"><img class="delete-mini-btn" :src="require('@/assets/images/arrow-up.png')"/></button>
    <button class="btn clear" :disabled="idx >= value.length-1" @click="updateIdx(1)"><img class="delete-mini-btn" :src="require('@/assets/images/arrow-down.png')"/></button>
  </div>
</template>

<script>
export default {
  name: 'TableActionBtns',
  props: {
    value: [Array],
    idx: [Number],
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
.table-action-btns {
  .delete-mini-btn {
    width: em(15px);
    object-fit: unset;
  }
}
</style>
<template>
  <section class="app-avatar flex align-center justify-center" :style="{width: renderSize, height: renderSize}">
    <slot v-if="$slots.default"/>
    <img class="avatar-img" v-else :src="imgSrc" alt="">
  </section>
</template>

<script>
export default {
  name: "Avatar",
  props: {
    account: [Object, undefined],
    size: [Number, undefined],
    img: [String, undefined],
  },
  computed: {
    imgSrc() {
      return this.accont? this.account.img || `https://robohash.org/${this.account.username}` : this.img || '';
    },
    renderSize() {
      const size = (this.size || 30) / 16;
      return size + 'em';
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.app-avatar {
  // width: em(30px);
  // height: em(30px);
  border-radius: 50%;
  border: em(2px) solid white;
  background: #dbdbdb;
  overflow: hidden;
  .avatar-img {
    height: 50%;
    width: 50%;
    border-radius: 50%;
    object-fit: cover;
  }
}
</style>
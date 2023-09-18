<template>
  <section class="app-avatar flex align-center justify-center" :style="{width: renderSize, height: renderSize}">
    <div v-if="$slots.default" :style="{fontSize: renderFontSize}">
      <slot/>
    </div>
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
    renderSizeEm() {
      const size = (this.size || 30) / 16;
      return size;
    },
    renderSize() {
      return this.renderSizeEm + 'em';
    },
    renderFontSize() {
      return (this.renderSizeEm*0.5) + 'em';
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
.dark-theme {
  .app-avatar {
    background: white;
    color: #676767 !important;
  }
}
</style>
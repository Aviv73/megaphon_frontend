<template>
  <footer class="app-footer flex">
    <div class="container flex align-center height-all width-all">
      <div class="powered-by flex align-end gap10">
        <!-- Powered by Megaphon -->
        <p>Powered by</p> <img :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "AppFooter",
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .app-footer {
    height: rem(60px);
    font-size: 0.6rem;
    .powered-by {
        direction: ltr;
        img {
          height: em(25px);
          width: unset;
        }
      }
  }
}
</style>
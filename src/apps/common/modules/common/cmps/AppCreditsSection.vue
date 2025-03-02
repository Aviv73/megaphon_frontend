<template>
  <div class="AppCreditsSection flex wrap align-center gap10">
    <div class="powered-by flex wrap align-end_ align-center gap10" v-if="false">
      <!-- Powered by Megaphon -->
      <p>Powered by</p> <img :src="require('@/apps/megaphonApp/assets/images/Megaphon_logo_v.png')" alt="Megaphon">
    </div>
    <template v-if="true">
      <p>Powered by: Megaphon</p>
      <span class="seperation-span">|</span>
      <p>Design: greissdesign</p>
      <span class="seperation-span">|</span>
      <p>Developing: misterbit</p>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AppCreditsSection'
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.AppCreditsSection {
  direction: ltr;
  color: #9D9D9D;
  font-size: rem(14px);
  @media (max-width: $small-screen-break) {
    width: 100%;
    text-align: center;  
    flex-direction: column;
    .seperation-span {display: none;}
  }
}
</style>
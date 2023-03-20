<template>
  <div class="sand-box-page container flex column align-center justify-center gap20 height-all">
    <div> SAND BOX </div>
    <div class="flex align-center space-around gap20 stars-container width-alll">
      <AnimationLoader :negative="true" class="loader" />
      <!-- <SunSistem/> -->
    </div>
  </div>
</template>
<script>
import AnimationLoader from '../cmps/AnimationLoader.vue';
import SunSistem from '../cmps/SunSistem.vue';

export default {
  name: 'SandBox',
  components: { AnimationLoader, SunSistem }
}
</script>

<style lang="scss" scoped>
.sand-box-page {
  // height: 100vh;
  background-color: black;
  color: white;
  .stars-container {
    position: relative;
    // border: 1px solid white;
    padding: 3px;
    .loader, .sun-sistem-container {
      width: 300px;
      height: 300px;
    }
    .sun-sistem-container {
      position: absolute;
  
    }
  }
}
</style>
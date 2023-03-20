<template>
  <footer class="app-footer flex-center">
    <h4 class="flex align-center justify-center gap10 wrap container">
      <CreditLogo/>
      © Aviv Issachar
      <a style="color: #feffbd;" :href="cvLink" target="_blank"><h3>- C.V -</h3></a>
    </h4>
  </footer>
</template>

<script>
import CreditLogo from './CreditLogo.vue'
export default {
  name: "AppFooter",
  components: { CreditLogo },
  data() {
    return {
      cvLink: 'https://docs.google.com/document/d/1chtvUmRJo38ZakzSWxqIyDgI6K1xi0eS/edit?usp=sharing&ouid=103323829961679615098&rtpof=true&sd=true'
      // cvLink: 'https://avivissachar73.github.io/AvivJs-Notes/#/cv'
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.red-theme {
  .app-footer { // RED_LAYOUT_FIX
    .credit-logo {
      color: white;
    }
  }
}
.app-footer {
    direction: ltr;
  }
</style>
<template>
  <footer class="app-footer flex column">
    MEGAPHONAPP
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
    .inner-area {
      padding: 20px;
    }
    .credits {
      // height: 60px;
      color: $layout-black;
      background-color: #F4CF7E;
    }
    
    h3 {
      color: white;
    }
  
    .content {
      background: linear-gradient(90deg, $layout-red 50%, $layout-black 50%);
      color: $light-white;
    }
    .right {
      flex: 1;
      background-color: $layout-black;
      padding-inline-start: 0;
    }
    .left {
      flex: 2;
      background-color: $layout-red;
      padding-inline-end: 0;
    }
  
    .contact-list {
      hr {
        width: 70px;
        height: 1px;
        align-self: flex-start;
        margin: 0;
        background-color: #fff;
        border: 0;
      }
    }
    .media-list {
      .media-preview {
        height: 55px;
        // width: 200px;
  
        img {
          height: 55px;
          width: 55px;
        }
        p {
          direction: ltr;
          width: 110px;
        }
      }
    }
  
  }
}
</style>
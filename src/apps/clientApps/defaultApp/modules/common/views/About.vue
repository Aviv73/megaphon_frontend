<template>
  <div class="about-page main-pad-y inner-container flex column gap30 height-all">

    <RoutesLocator :links="[
      {label: $t('main'), to: $store.getters.mainLinkRouteTo },
      {label: $t('about'), to: {name: 'AboutPage' } },
    ]"/>

    <div class="about-msg flex column gap10">
      <h1>
        אודות
      </h1>
    </div>
    
  </div>
</template>
<script>
import RoutesLocator from '../../release/cmps/RoutesLocator.vue'
import { crewMembers, features } from '../../../static.data.js'
export default {
  components: { RoutesLocator },
  name: 'About',
  data() {
    return { crewMembers, features }
  } 
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.about-page {
  .routes-locator {
    // margin-inline-start: 60px;
  }
  h2 {
    color: $layout-red;
    // margin-inline-start: 60px;
    font-weight: bold;
  }
  .about-msg {
    // margin-inline-start: 60px;
    max-width: 60%;
  }
  .crew-section, .features-section {
    li {
      text-align: center;
      img {
        width: 240px;
        height: 240px;
        border-radius: 50%;
        // border: 8px solid $layout-red;
        border: 0px solid $layout-red;
      }
    }
  }
  .crew-section {
    li {
      .name {
        color: $layout-red;
      }
      
      .member-info {
        width: 150px;
        p {
          color: $light-gray;
        }
      }
    }
  }
  .features-section {
    padding-top: 120px;
    h2 {
      margin-bottom: 100px;
    }
    li {
      height: auto;
      flex: 1;
      position: relative;
      border-radius: 10px;
      color: $light-white;
      .title {
        color: white;
      }
      img {
        border-color: white;
        position: absolute;
        top: 0;
        transform: translateY(-50%);
      }
      .its-content {
        margin-top: 120px;
        padding: 20px;
        line-height: 1.3em;
      }
      &:first-child {
        background-color: $layout-red;
      }
      &:nth-child(2) {
        color: black;
        .title {
          color: black;
        }
        background-color: #F4CF7E;
      }
      &:nth-child(3) {
        background-color: #699FBA;
      }
    }
  }
}
</style>
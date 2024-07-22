<template>
  <div class="app agam-app">
    <div class="app-content">
      <!-- <AppAside/> -->
      <div class="right">
        <AppHeader/>
        <main class="app-main">
          <router-view class="main-content"/>
        </main>
      </div>
    </div>
    <AppFooter/>
  </div>
</template>

<script>
import './assets/style/index.scss';

import AppHeader from './cmps/agam_AppHeader.vue';
import AppFooter from './cmps/agam_AppFooter.vue';


export default {
  name: 'AgamApp',
  components: {
    AppHeader,
    AppFooter,
    // AppAside
  },
  created() {
    document.title = 'אגם הוצאה לאור';
  }
}
</script>

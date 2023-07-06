<template>
  <div class="app default-app">
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

import AppHeader from './modules/common/cmps/AppHeader.vue';
import AppFooter from './modules/common/cmps/AppFooter.vue';


export default {
  name: 'AgamApp',
  components: {
    AppHeader,
    AppFooter,
    // AppAside
  },
  created() {
    document.title = 'אגם הוצאת ספרים';
  }
}
</script>

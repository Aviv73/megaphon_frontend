<template>
  <aside class="app-aside flex column">
    <router-link class="logo" :to="{name: 'HomePage'}">P.S</router-link>
    <nav class="flex column">
      <router-link :to="{name: 'AboutPage'}">!</router-link>
      <router-link :to="{name: 'SettingsPage'}">S</router-link>
      <router-link :to="{name: 'ExamplePage'}">E</router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'AppAside'
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global/index';
.app-aside {
  .logo {
    height: $header-height;
    @include flex-center;
  }
  gap: 50px;
  nav {
    margin: 0 auto;
    gap: 50px;
    a {
      width: 30px;
      height: 30px;
      border: 1px solid black;
      border-radius: 50%;
      @include flex-center;
    }
  }
}
</style>
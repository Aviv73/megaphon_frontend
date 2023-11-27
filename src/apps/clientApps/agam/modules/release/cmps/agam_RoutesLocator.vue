<template>
  <section class="routes-locator flex gap10 wrap">
    <template v-for="(link, idx) in links">
      <router-link :disabled="link.disabled" :to="link.to" :key="'link_'+idx">{{link.label}}</router-link>
      <span v-if="idx !== links.length-1" :key="'span_'+idx"> > </span>
    </template>
  </section>
</template>

<script>
export default {
  name: 'agam_RoutesLocator',
  props: {
    links: {
      type: Array,
      default: () => [] // {label, to}
    }
  }
}
</script>

<style lang="scss">
.agam-app {
  .routes-locator {
    .router-link-exact-active {
      font-weight: bold;
    }
  }
}
</style>
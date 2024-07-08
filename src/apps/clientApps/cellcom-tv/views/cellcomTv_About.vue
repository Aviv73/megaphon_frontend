<template>
  <div class="about-page container flex-center height-all">
  </div>
</template>

<script>
export default {
  name: 'cellcomTv_about',
  created() {
    const releaseId = this.$store.getters['release/initReleaseId'];
    this.$router.push({
      // name: releaseId? 'ReleaseDetails' : 'AboutPage',
      // params: {id: releaseId}
      name: 'ReleasePage'
    });
  }
}
</script>

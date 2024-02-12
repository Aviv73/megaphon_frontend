<template>
  <div class="home-page container flex-center height-all">
  </div>
</template>

<script>
export default {
  name: 'agam_Home',
  created() {
    // const releaseId = this.$store.getters['release/initReleaseId'];
    this.$router.push({
      // name: releaseId? 'ReleaseDetails' : 'AboutPage',
      // params: {id: releaseId}
      name: 'AboutPage',
      // params: {id: releaseId}
    });
  }
}
</script>

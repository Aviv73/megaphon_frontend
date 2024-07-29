<template>
  <div class="home-page container flex-center height-all">
  </div>
</template>

<script>
export default {
  name: 'streamTv_Home',
  created() {
    // const releaseId = this.$store.getters['release/initReleaseId'];
    this.$router.push({
      // name: releaseId? 'ReleaseDetails' : 'AboutPage',
      // params: {id: releaseId}
      name: 'ReleasePage'
    });
  }
}
</script>

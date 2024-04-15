<template>
  <div class="contact-report-page">
    <h1>
      CONTACT REPORT!
    </h1>
    <div>
      <pre class="ltr">
        {{report}}
      </pre>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactReportPage',
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    routeEmail() {
      return this.$route.query.email;
    },
    report() {
      return this.$store.getters['release/selectedContactReport'];
    },
  },
  methods: {
    loadContactReport() {
      const email = this.routeEmail;
      const id = this.routeId === 'unknown' ? '' : this.routeId;
      this.$store.dispatch({ type: 'release/loadContactReport', id, email });
    }
  },
  created() {
    this.loadContactReport();
  }
}
</script>

<style>
.contact-report-page {

}
</style>
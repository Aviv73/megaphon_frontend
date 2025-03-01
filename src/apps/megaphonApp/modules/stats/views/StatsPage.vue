<template>
  <section class="stats-page flex column gap10 width-all">
    <h2>{{$t('statsLocales.stats')}}</h2>
    <hr/>
    <ReportList/>
    <Loader v-if="isLoading" fullScreen/>
  </section>
</template>

<script>
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
import Tooltip from '../../../../common/modules/common/cmps/Tooltip.vue';

import ReportList from '../cmps/ReportList.vue';

export default {
  name: 'StatsPage',
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
    organizationId() {
      return this.$route.params.organizationId;
    },
    filterBy() {
      return this.$store.getters['stats/filterBy'];
    },
    isLoading() {
      return this.$store.getters['stats/isLoading'] || this.$store.getters['release/isLoading'] || this.$store.getters['organization/isLoading'];
    },
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    },
  },
  watch: {
    organizationId() {
    },
  },
  components: { Loader, FormInput, Tooltip, ReportList }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .stats-page {
    padding: rem(20px) 0;
    hr {
      background-color: var(--clr-3);
      border: 1px solid var(--clr-3);
      height: 1px;
      width: 100%;
    }
  }
}
</style>
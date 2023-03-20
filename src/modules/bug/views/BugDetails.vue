<template>
  <div class="bug-details flex column gap10" v-if="bug">
    <!-- <router-link :to="{name: 'BugEdit', params: {id: bug._id}}"><button class="btn">{{$t('edit')}}</button></router-link> -->
    <div>
      <p>{{$t('createdBy')}}:</p>
      <MiniAccountPreview :account="bug.createdBy"/>
    </div>
    <h2>{{bug.title}}</h2>
    <p>{{bug.desc}}</p>
  </div>
</template>

<script>
import MiniAccountPreview from '@/modules/account/cmps/MiniAccountPreview.vue';
export default {
  components: { MiniAccountPreview },
  name: 'BugDetails',
  methods: {
    getBug() {
      this.$store.dispatch({ type: 'bug/loadBug', id: this.$route.params.id });
    }
  },
  computed: {
    bug() {
      return this.$store.getters['bug/selectedItem'];
    }
  },
  created() {
    this.getBug();
  },
  watch: {
    '$route.params.id'() {
      this.getBug();
    }
  }
}
</script>
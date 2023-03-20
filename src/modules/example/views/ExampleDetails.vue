<template>
  <div class="example-details">
    <pre v-if="item">{{item}}</pre>
    <div>
      <router-link v-if="item" :to="{name: 'ExampleEdit', params: {id: item._id}}"><button>{{$t('edit')}}</button></router-link>
      <button @click="removeItem">{{$t('delete')}}</button>
    </div>
  </div>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';

export default {
  name: 'ExampleDetails',
  methods: {
    getItem() {
      this.$store.dispatch({ type: 'example/loadItem', id: this.$route.params.id });
    },
    async removeItem() {
      await this.$store.dispatch({ type: 'example/removeItem', id: this.item._id });
      this.$router.push({name: 'ExamplePage'});
    }
  },
  computed: {
    item() {
      return this.$store.getters['example/selectedItem'];
    }
  },
  created() {
    this.getItem();
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    }
  },
  components: {
    Loader
  }
}
</script>
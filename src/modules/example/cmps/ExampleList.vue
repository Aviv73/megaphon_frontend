<template>
  <ul class="example-list">
    <ExamplePreview :item="item" v-for="item in items" :key="item._id"/>
  </ul>
</template>

<script>
import ExamplePreview from './ExamplePreview.vue'
export default {
  name: 'ExampleList',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  components: { ExamplePreview }
}
</script>
<template>
  <li class="item-preview">
    <router-link :to="'/example/' + item._id">
      <pre>{{item}}</pre>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'ExamplePreview',
  props: {
    item: {
      type: Object,
      required: true
    }
  }
}
</script>
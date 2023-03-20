<template>
  <li class="item-preview">
    <button class="btn small" @click="$emit('remove', item._id)">X</button>
    <router-link :to="{name: itemDetailesPageName, params: {id: item._id}}">
      <pre>{{item}}</pre>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'ItemPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String]
  }
}
</script>
<template>
  <ul class="item-list flex align-start wrap gap40">
    <component 
      :is="componentToRender"
      v-for="item in items"
      :key="item._id"
      :item="item"
      :itemDetailesPageName="itemDetailesPageName"
      @remove="id => $emit('remove', id)"
      @edit="item => $emit('edit', item)"
    />
  </ul>
</template>

<script>
import ItemPreview from './ItemPreview.vue'
export default {
  name: 'ItemList',
  props: {
    items: {
      type: Array,
      required: true
    },
    singlePreviewCmp: [Object],
    itemDetailesPageName: [String]
  },
  computed: {
    componentToRender() {
      return this.singlePreviewCmp || 'ItemPreview';
    }
  },
  components: { ItemPreview }
}
</script>
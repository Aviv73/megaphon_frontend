<template>
  <ul class="item-list align-start wrap gap40" :class="{ grid: layoutMode === 'grid', flex: layoutMode=== 'flex' }">
    <component 
      :is="componentToRender"
      v-for="item in items"
      :key="item._id"
      :item="item"
      :itemDetailesPageName="itemDetailesPageName"
      @remove="id => $emit('remove', id)"
      @edit="item => $emit('edit', item)"
      v-bind="propsToPass"
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
    itemDetailesPageName: [String],
    propsToPass: [Object],
    layoutMode: {
      type: String,
      default: 'flex'
    }
  },
  computed: {
    componentToRender() {
      return this.singlePreviewCmp || 'ItemPreview';
    }
  },
  components: { ItemPreview }
}
</script>
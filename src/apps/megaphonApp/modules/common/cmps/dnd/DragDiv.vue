<template>
  <drag @dragstart="onDrag" class="drag-div">
    <slot/>
  </drag>
</template>

<script>
export default {
  name: 'DragDiv',
  props: {
    onDrag: [Function]
  }
}
</script>

<style>

</style>
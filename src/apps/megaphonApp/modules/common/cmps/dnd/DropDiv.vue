<template>
  <drop @drop="onDrop" class="drop-div" @dragenter="$emit('dragenter')" @dragover="() => {}" @dragleave="$emit('dragleave')">
    <slot/>
  </drop>
</template>

<script>
export default {
  name: 'DropDiv',
  props: {
    onDrop: [Function]
  }
}
</script>

<style>

</style>
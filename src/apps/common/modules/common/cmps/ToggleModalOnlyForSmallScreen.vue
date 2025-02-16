<template>
  <component :is="isScreenWide? 'div' : ToggleModal" :fullScreen="true" class="ToggleModalOnlyForSmallScreen">
      <template v-if="!isScreenWide" #toggler>
        <slot name="toggler"/>
      </template>
      <slot v-if="$slots.content" name="content"/>
      <slot v-else />
  </component>
</template>

<script>
import ToggleModal from './ToggleModal.vue';
export default {
  name: 'ToggleModalOnlyForSmallScreen',
  data() {
    return {
      ToggleModal
    }
  },
  computed: {
    isScreenWide() {
      return this.$store.getters.isScreenWide;
    }
  },
  components: { ToggleModal }
}
</script>

<style>

</style>
<template>
  <div class="toggle-btns">
    <button v-for="opt in mapedOptions" :key="opt.label"
      :class="{selected: localVal === opt.value}"
      @click.prevent.stop="emitVal(opt.value)"
    >
      <img v-if="opt.img" :src="opt.img"/>
      <span v-if="opt.label">{{opt.label}}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ToggleBtns',
  props: {
    value: [String],
    options: [Array],
  },
  data() {
    return {
      localVal: this.value
    }
  },
  computed: {
    mapedOptions() {
      return this.options.map(opt => typeof opt === 'object'? opt : { label: opt, value: opt });
    }
  },
  methods: {
    emitVal(val) {
      this.localVal = val;
      this.$emit('input', val);
    },
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.toggle-btns {

}
</style>
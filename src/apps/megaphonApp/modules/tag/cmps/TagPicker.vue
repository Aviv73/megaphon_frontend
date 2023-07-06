<template>
  <div class="tag-picker">
    <FormInput placeholder="tag.tags" type="multiselect" :items="selectOpts" v-model="val" @change="val => $emit('input', val)"/>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
export default {
  name: 'TagPicker',
  data() {
    return {
      val: this.value || []
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    selectOpts() {
      return this.allTags.map(c => {
        return {
          label: c.name,
          value: c
        }
      })
    },
    allTags() {
      return this.$store.getters['tag/items'];
    }
  },
  methods: {
    async loadAllTags() {
      await this.$store.dispatch({ type: 'tag/loadItems' });
    }
  },
  created() {
    if (!this.allTags.length) this.loadAllTags();
  },
  components: { FormInput }
}
</script>

<style lang="scss">
.megaphon-app {
  .tag-picker {
    .form-input {
      width: 200px;
      height: 30px;
    }
  }
}
</style>
<template>
  <div class="tag-picker">
    <FormInput :label="showLabel? 'tag.tags': ''" placeholder="tag.tags" type="multiselect" :showVals="true" :items="selectOpts" v-model="val" @change="emitChange"/>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
export default {
  name: 'TagPicker',
  data() {
    return {
      val: this.value || [],
    }
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    getOnlyIds: {
      type: Boolean,
      default: false
    },
    showLabel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectOpts() {
      return this.allTags.sort((a, b) => a.name > b.name? 1 : -1).map(c => {
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
    },
    emitChange(val) {
      const valToEmit = this.getOnlyIds? val.map(c => c._id) : val;
      this.$emit('input', valToEmit)
    }
  },
  async created() {
    if (!this.allTags.length) await this.loadAllTags();
      if (this.getOnlyIds) this.val = this.val.map(id => this.allTags.find(tag => tag._id === id));
  },
  components: { FormInput }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .tag-picker {
    .form-input {
      // width: em(350px);
      min-height: em(30px);
    }
  }
}
</style>
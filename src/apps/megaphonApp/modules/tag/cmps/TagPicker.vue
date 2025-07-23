<template>
  <div class="tag-picker">
    <FormInput :label="showLabel? 'tag.tags': ''" placeholder="tag.tags" type="multiselect" :showVals="true" :items="selectOpts" v-model="val" @change="emitChange" :allowAddValsToMultiSelect="allowAddValsToMultiSelect"/>
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
    showLabel: {
      type: Boolean,
      default: false
    },
    onlyRelevants: {
      type: Boolean,
      default: false
    },
    organizationId: {
      type: String,
      required: false
    },
    allowAddValsToMultiSelect: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    selectOpts() {
      return this.allTags.sort((a, b) => a.name > b.name? 1 : -1).map(c => {
        return {
          label: c.name,
          value: c._id
        }
      })
    },
    allTags() {
      console.log(this.$store.getters['tag/items']);
      return this.$store.getters['tag/items'];
    }
  },
  methods: {
    async loadAllTags() {
      await this.$store.dispatch({ type: 'tag/loadItems', filterBy: { onlyRelevants: this.onlyRelevants || undefined, organizationId: this.organizationId, pagination: { noLimit: true } } });
    },
    emitChange(val) {
      val = val.filter(Boolean);
      const valToEmit = val;
      this.$emit('input', valToEmit)
    }
  },
  async created() {
    // if (!this.allTags.length)
    await this.loadAllTags();
  },
  watch: {
    organizationId() {
      this.loadAllTags();
    }
  },
  components: { FormInput }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
// .dark-theme.megaphon-app {
//   .tag-picker {
//     .form-input {
//       input {
//         color: black;
//       }
//     }
//   }
// }
.megaphon-app {
  .tag-picker {
    .form-input {
      // width: em(350px);
      min-height: em(30px);
    }
  }
}
</style>
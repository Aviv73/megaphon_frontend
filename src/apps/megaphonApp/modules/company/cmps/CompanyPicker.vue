<template>
  <div class="company-picker">
    <FormInput :label="showLabel? 'company.companies' : ''" placeholder="company.companies" type="multiselect" :showVals="true" :items="selectOpts" v-model="val" @change="emitChange"/>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
export default {
  name: 'CompanyPicker',
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
    getOnlyIds: {
      type: Boolean,
      default: false
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
    }
  },
  computed: {
    selectOpts() {
      return this.allCompanies.sort((a, b) => a.name > b.name? 1 : -1).map(c => {
        return {
          label: c.name,
          value: c
        }
      })
    },
    allCompanies() {
      return this.$store.getters['company/items'];
    }
  },
  methods: {
    async loadAllCompanies() {
      await this.$store.dispatch({ type: 'company/loadItems', filterBy: { onlyRelevants: this.onlyRelevants }, organizationId: this.organizationId });
    },
    emitChange(val) {
      const valToEmit = this.getOnlyIds? val.map(c => c._id) : val;
      this.$emit('input', valToEmit)
    }
  },
  async created() {
    if (!this.allCompanies.length) await this.loadAllCompanies();
      if (this.getOnlyIds) this.val = this.val.map(id => this.allCompanies.find(comp => comp._id === id));
  },
  components: { FormInput }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.dark-theme.megaphon-app {
  .company-picker {
    .form-input {
      input {
        color: black;
      }
    }
  }
}
.megaphon-app {
  .company-picker {
    .form-input {
      // width: em(350px);
      min-height: em(30px);
    }
  }
}
</style>
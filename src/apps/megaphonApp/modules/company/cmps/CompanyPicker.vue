<template>
  <div class="company-picker">
    <FormInput placeholder="company.companies" type="multiselect" :items="selectOpts" v-model="val" @change="val => $emit('input', val)"/>
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
  },
  computed: {
    selectOpts() {
      return this.allCompanies.sort((a, b) => a.name > b.name).map(c => {
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
      await this.$store.dispatch({ type: 'company/loadItems' });
    }
  },
  created() {
    if (!this.allCompanies.length) this.loadAllCompanies();
  },
  components: { FormInput }
}
</script>

<style lang="scss">
.megaphon-app {
  .company-picker {
    .form-input {
      width: 200px;
      height: 30px;
    }
  }
}
</style>
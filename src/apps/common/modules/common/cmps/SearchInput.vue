<template>
  <form @submit.prevent="onSubmit" class="flex align-center search-input">
    <FormInput class="width-content" type="text" :placeholder="placeholder" v-model="val"/>
    <button class="btn secondary">{{$t(btn)}}</button>
  </form>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue'

export default {
  name: 'SearchInput',
  components: { FormInput },
  props: {
    value: { required: false, type: String, default: '' },
    btn: { required: false, type: String, default: 'search' },
    placeholder: { required: false, type: String, default: 'search' },
  },
  data() {
    return {
      val: this.value
    }
  },
  methods: {
    onSubmit() {
      this.$emit('input', this.val);
      this.$emit('change', this.val);
    }
  },
  watch: {
    value() {
      this.val = this.value;
    }
  },
}
</script>

<style lang="scss">
.search-input {
  border-radius: em(5px);
  overflow: hidden;
  border: 1px solid rgb(114, 114, 114);
  width: 100%;
  .form-input {
    width: unset;
    flex: 1;
    input {
      border: unset;
      // background-color: rgba(0, 0, 0, 0.1);
    }
  }
  .btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // border-start-start-radius: 0;
    // border-end-start-radius: 0;
    border-radius: unset;
    // background-color: #fff;
  }
}
</style>
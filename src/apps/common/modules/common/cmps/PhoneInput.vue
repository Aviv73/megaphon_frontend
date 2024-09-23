<template>
    <VuePhoneNumberInput
      class="ltr"
      v-model="val.number"
      @update="onPhoneInput"

      mode="international"
      :default-country-code="val.countryCode || 'IL'"
    />
</template>

<script>
// import VueTelInput from 'vue-tel-input';
// import 'vue-tel-input/dist/vue-tel-input.css';
// // import 'vue-tel-input/vue-tel-input.css';

import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';


export default {
  name: 'PhoneInput',
  components: { VuePhoneNumberInput },
  props: {
    value: { required: true, type: null },
  },
  data() {
    return {
      val: typeof this.value === 'object'? this.value : { number: '' }
    };
  },
  created() {
    console.log('WOWO', this.val, this.value);
  },
  methods: {
    onPhoneInput(data) {
      const res = {
        number: data.phoneNumber || '', // "0502075843",
        formatted: data.formattedNumber || '', // "+972502075843"
        countryCallingCode: data.countryCallingCode || '', // "972"
        countryCode: data.countryCode || '' // "IL"
      }
      this.$emit('input', res);
    },
  },
};
</script>


<style lang="scss">
</style>
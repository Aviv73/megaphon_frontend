<template>
  <div class="container msgs-page flex column gap10">
    <form @submit.prevent="saveMsgs">
      <ul class="flex column gap15">
        <li v-for="msg in msgs" :key="msg._id" class="flex align-center gap15">
          <FormInput label="emoji" v-model="msg.ui"/>
          <FormInput label="maxDistM" v-model="msg.maxDistM"/>
          <FormInput label="name" v-model="msg.name"/>
        </li>
      </ul>
      <button>{{$t('save')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '@/modules/common/cmps/FormInput.vue';
import evEmmiter from '@/modules/common/services/event-emmiter.service';

export default {
  name: 'MsgsPage',
  data() {
    return {
      msgs: []
    }
  },
  methods: {
    async saveMsgs() {
      const updatedSettings = await this.$store.dispatch({ type: 'ed/updateMsgs', msgs: this.msgs });
      this.msgs = JSON.parse(JSON.stringify(updatedSettings));
    },
    async loadMsgs() {
      this.msgs = await this.$store.dispatch('ed/loadMsgs');
    }
  },
  created() {
    this.loadMsgs();
  },
  components: { FormInput }
}
</script>
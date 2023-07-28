<template>
  <div class="contact-edit flex column align-start gap30" v-if="itemToEdit">
    <h2 v-if="itemToEdit._id">{{$t('contact.editContact')}}</h2>
    <h2 v-else>{{$t('contact.createContact')}}</h2>
    <form v-if="itemToEdit" @submit.prevent="" class="flex column gap20 simple-form">
      <FormInput labelholder="email" :required="true" type="text" v-model="itemToEdit.email"/>
      <FormInput labelholder="firstName" :required="true" type="text" v-model="itemToEdit.firstName"/>
      <FormInput labelholder="lastName" :required="true" type="text" v-model="itemToEdit.lastName"/>
      <FormInput labelholder="contact.role" type="text" v-model="itemToEdit.role"/>
      <!-- <FormInput type="text" v-model="itemToEdit.name"/> -->
      <TagPicker :showLabel="true" :getOnlyIds="true" v-model="itemToEdit.tags"/>
      <CompanyPicker :showLabel="true" :getOnlyIds="true" v-model="itemToEdit.company"/>
      <FormInput labelholder="contact.phone" type="text" v-model="itemToEdit.phone"/>
      <FormInput labelholder="contact.cellular" type="text" v-model="itemToEdit.cellular"/>
      <FormInput labelholder="contact.notes" type="text" v-model="itemToEdit.notes"/>
    </form>
    <div class="flex align-center gap30">
      <button class="btn big danger" v-if="itemToEdit._id" @click="deleteItem">{{$t('delete')}}</button>
      <button class="btn big primary" :disabled="!isItemValid" @click="saveItem">{{$t('submit')}}</button>
      <button class="btn big" @click="close">{{$t('cancel')}}</button>
    </div>
  </div>

</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import CompanyPicker from '../../company/cmps/CompanyPicker.vue';
import TagPicker from '../../tag/cmps/TagPicker.vue';
export default {
  name: 'ContactEdit',
  data() {
    return {
      itemToEdit: null
    }
  },
  computed: {
    isItemValid() {
      return this.itemToEdit && this.itemToEdit.email && this.itemToEdit.firstName && this.itemToEdit.lastName;
    }
  },
  methods: {
    async getItem() {
      this.itemToEdit = await this.$store.dispatch({ type: 'contact/loadItem', id: this.$route.params.id });
      this.itemToEdit.organizationId = this.$route.params.organizationId;
    },
    async saveItem() {
      if (!this.isItemValid) return;
      await this.$store.dispatch({ type: 'contact/saveItem', item: this.itemToEdit });
      this.close();
    },

    async deleteItem() {
      await this.$store.dispatch({ type: 'contact/removeItem', id: this.$route.params.id, organizationId: this.$route.params.organizationId });
      this.close();
    },
    close() {
      this.$router.push({ name: 'ContactPage', params: { organizationId: this.$route.params.organizationId } })
    }
  },
  created() {
    this.getItem();
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    }
  },
  components: {
    FormInput,
    CompanyPicker,
    TagPicker
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  // .contact-edit {
  //   .input {
  //     flex: 1;
  //   }
  //   .label {
  //     width: em(100px);
  //   }
  // }
}
</style>
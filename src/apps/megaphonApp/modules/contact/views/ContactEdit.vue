<template>
  <div class="contact-edit app-form-styling flex column align-start gap30" v-if="itemToEdit">
    <h2 v-if="itemToEdit._id">{{$t('contactLocales.editContact')}}</h2>
    <h2 v-else>{{$t('contactLocales.createContact')}}</h2>
    <form v-if="itemToEdit" @submit.prevent="" class="flex column gap20 simple-form">
      <FormInput labelholder="firstName" :required="true" type="text" v-model="itemToEdit.firstName"/>
      <FormInput labelholder="lastName" :required="true" type="text" v-model="itemToEdit.lastName"/>
      <FormInput labelholder="email" :required="true" type="text" v-model="itemToEdit.email"/>
      <!-- <FormInput labelholder="contactLocales.phone" type="phone-number" v-model="itemToEdit.phone"/> -->
      <FormInput labelholder="contactLocales.mobile" type="phone-number" v-model="itemToEdit.mobileData" @change="val => itemToEdit.mobile = val.formatted"/>
      <FormInput labelholder="contactLocales.role" type="text" v-model="itemToEdit.role"/>
      <!-- <FormInput type="text" v-model="itemToEdit.name"/> -->
      <TagPicker     :organizationId="orgId" :showLabel="true" v-model="itemToEdit.tags"    :allowAddValsToMultiSelect="true"/>
      <CompanyPicker :organizationId="orgId" :showLabel="true" v-model="itemToEdit.company" :allowAddValsToMultiSelect="true"/>
      <!-- <FormInput labelholder="contactLocales.cellular" type="text" v-model="itemToEdit.cellular"/> -->
      <FormInput labelholder="contactLocales.notes" type="textarea" v-model="itemToEdit.note"/>
      <div class="flex column gap20">
        <p>{{$t('settingsLocales.settings')}}:</p>
        <FormInput labelholder="contactLocales.maxTimesAllowdToWatchVideo" type="number" :min="0" v-model="itemToEdit.settings.maxTimesAllowdToWatchVideo"/>
      </div>
    </form>
    <div v-if="itemToEdit._id">
      <button @click="toggleSubscribtionValue" class="btn big primary">
        <p v-if="unsubscribed">{{$t('contactLocales.reSubscribe')}}</p>
        <p v-else>{{$t('contactLocales.unsubscribe')}}</p>
      </button>
    </div>
    <div class="flex align-center gap30">
      <button class="btn big danger" v-if="itemToEdit._id" @click="deleteItem">{{$t('delete')}}</button>
      <button class="btn big primary" :disabled="!isItemValid" @click="saveItem">{{$t('save')}}</button>
      <button class="btn big" @click="close">{{$t('cancel')}}</button>
    </div>
    <Loader v-if="isLoading" fullScreen/>
  </div>

</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import CompanyPicker from '../../company/cmps/CompanyPicker.vue';
import TagPicker from '../../tag/cmps/TagPicker.vue';
import { distributionService } from '../../release/services/distribution.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import Loader from '@/apps/common/modules/common/cmps/Loader.vue';
export default {
  name: 'ContactEdit',
  data() {
    return {
      itemToEdit: null,
      unsubscribed: false
    }
  },
  computed: {
    isItemValid() {
      return this.itemToEdit && this.itemToEdit.email && this.itemToEdit.firstName && this.itemToEdit.lastName;
    },
    orgId() {
      return this.$route.params.organizationId;
    },
    isLoading() {
      return this.$store.getters['contact/isLoading'];
    }
  },
  methods: {
    async getItem() {
      this.itemToEdit = await this.$store.dispatch({ type: 'contact/loadItem', id: this.$route.params.id, organizationId: this.orgId });
      this.itemToEdit.organizationId = this.orgId;
      this.unsubscribed = this.itemToEdit.unsubscribed || false;
      delete this.itemToEdit.unsubscribed;
      if (!this.itemToEdit.settings) this.itemToEdit.settings = { maxTimesAllowdToWatchVideo: 10 }
    },
    async saveItem() {
      if (!this.isItemValid) return;
      await this.$store.dispatch({ type: 'contact/saveItem', item: this.itemToEdit, organizationId: this.orgId });
      this.close();
    },

    async deleteItem() {
      await this.$store.dispatch({ type: 'contact/removeItem', id: this.$route.params.id, organizationId: this.orgId });
      this.close();
    },
    close() {
      this.$router.push({ name: 'ContactPage', params: { organizationId: this.orgId } })
    },
    async toggleSubscribtionValue() {
      if (!await alertService.Confirm(this.$t('contactLocales.confirmToggleSubscriptionValueMsg'))) return;
      this.$store.commit({ type: 'contact/setLoading', val: true });
      const newVal = await distributionService.updateSubscriptionValue(this.itemToEdit._id, this.orgId, !this.unsubscribed);
      this.unsubscribed = newVal.value;
      this.$store.commit({ type: 'contact/setLoading', val: false });
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
    TagPicker,
    Loader
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .contact-edit {
    padding: em(20px) 0;
  //   .input {
  //     flex: 1;
  //   }
  //   .label {
  //     width: em(100px);
  //   }
  }
}
</style>
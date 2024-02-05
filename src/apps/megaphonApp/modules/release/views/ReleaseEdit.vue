<template>
  <div class="release-edit app-form-styling flex column gap20" v-if="itemToEdit && org">
    <header class="header tab-nav">
      <div class="container width-all">
        <button @click="showDesign = false" :class="{selected: !showDesign}">{{$t('release.editRelease')}}</button>
        <button :disabled="!itemToEdit._id" @click="showDesign = true" :class="{selected: showDesign}">{{$t('release.designAndPreview')}}</button>
      </div>
    </header>
    <main class="form-content container flex column gap30 width-all">
      <template v-if="!showDesign">
        <h2>{{$t(itemToEdit._id? 'release.editRelease' : 'release.createRelease')}} > {{selectedReleaseTypeItem?.name || ''}}</h2>
        <form v-if="itemToEdit" @submit.prevent="" class="flex column gap20">
          <DynamicInput v-for="(dataField, idx) in dataFields" :key="idx" :dataField="dataField" :basePath="dataField.fieldName" :value="getVal(dataField.fieldName)" @input="(val, setPath, isForceUpdate) => setVal(val, setPath, isForceUpdate)" :parentItem="itemToEdit.releaseData" :organization="org"/>
        </form>
      </template>
      <ReleaseDesignViewer
        v-else
        :release="itemToEdit"
        :organization="org"
        @design-template-updated="(key, val) => itemToEdit.design[key] = val"
      />
    </main>
    <footer class="footer width-all">
      <div class="flex align-center space-between container height-all">
        <div>
          <button class="btn big" v-if="itemToEdit._id" @click="deleteItem">{{$t('delete')}}</button>
        </div>
        <div class="flex align-center gap30 height-all">
          <button class="btn big" @click="close">{{$t('close')}}</button>
          <button class="btn big primary" :disabled="!isItemValid" @click="saveItemAndClose">{{$t('release.saveAndClose')}} <img :src="require('@/apps/megaphonApp/assets/images/save_white.svg')"/></button>
          <button class="btn big primary" :disabled="!isItemValid" @click="saveItem">{{$t('save')}} <img :src="require('@/apps/megaphonApp/assets/images/save_white.svg')"/></button>
          <button class="btn big primary" :disabled="!isItemValid" @click="confirmAndDistribute">{{$t('release.confirmAndDistribute')}}</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getDeepVal, setDeepVal } from '../../../../common/modules/common/services/util.service';
import DynamicInput from '../cmps/DynamicFormInputs/DynamicInput.vue';
import { createItemForDynamicForm } from '../../common/services/CreateItemForDynamicForm';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import ReleaseDesignViewer from '../cmps/ReleaseDesignViewer.vue';
import { templateUtils } from '../../common/services/template.util.service';
export default {
  name: 'ReleaseEdit',
  data() {
    return {
      itemToEdit: null,
      initialItem: null,
      org: null,
      showDesign: false,

      dataFields: []
    }
  },
  computed: {
    orgId() {
      return this.$route.params.organizationId;
    },
    isItemValid() {
      return !!this.itemToEdit;
    },  
    releaseType() {
      return this.itemToEdit?.releaseType || this.$route.query.releaseType || '';
    },

    selectedReleaseTypeItem() {
      if (!this.org || !this.releaseType) return null;
      // return this.org.releaseTypes.find(c => c.id === this.releaseType);
      return templateUtils.getRelevantReleaseTypeItemForRelease(this.releaseType, this.org);
    },
    // dataFields() {
    //   if (!this.selectedReleaseTypeItem) return []
    //   const dataFields = JSON.parse(this.selectedReleaseTypeItem.dataFieldsStr);
    //   return dataFields;
    // },

    didChange() {
      return JSON.stringify(this.itemToEdit) !== JSON.stringify(this.initialItem);
    },
  },
  methods: {
    async loadReleaseDataFields() {
      this.dataFields = await this.$store.dispatch({ type: 'organization/loadReleaseDataFields', dataFieldsLocalFilePath: this.selectedReleaseTypeItem?.dataFieldsLocalFilePath, organizationId: this.orgId, releaseType: this.releaseType });
    },
    async getOrg() {
      this.org = await this.$store.dispatch({ type: 'organization/loadItem', id: this.orgId });
    },
    async getItem() {
      this.itemToEdit = await this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id, organizationId: this.orgId });
      await this.loadReleaseDataFields();
      if (!this.itemToEdit.organizationId) this.itemToEdit.organizationId = this.orgId;
      if (!this.itemToEdit.releaseType) this.itemToEdit.releaseType = this.releaseType;
      const emptyDataItem = createItemForDynamicForm(this.dataFields);
      for (let key in emptyDataItem) {
        if (this.itemToEdit.releaseData[key] === undefined) this.itemToEdit.releaseData[key] = emptyDataItem[key];
      }
      this.initialItem = JSON.parse(JSON.stringify(this.itemToEdit));
    },
    async saveItem() {
      if (!this.isItemValid) return;
      const isNew = !this.itemToEdit._id;
      this.itemToEdit = await this.$store.dispatch({ type: 'release/saveItem', item: this.itemToEdit, organizationId: this.orgId });
      this.initialItem = JSON.parse(JSON.stringify(this.itemToEdit));
      if (isNew) this.$router.push({params: {id: this.itemToEdit._id}});
    },
    async saveItemAndClose() {
      await this.saveItem();
      this.close();
    },
    async confirmAndDistribute() {
      await this.saveItem();
      this.$router.push({ name: 'ReleaseDistribution', params: { organizationId: this.orgId, id: this.$route.params.id } });
    },


    async deleteItem() {
      await this.$store.dispatch({ type: 'release/removeItem', id: this.$route.params.id, organizationId: this.orgId });
      this.navigateOut();
    },
    async close() {
      if (
        this.didChange && 
        !await alertService.Confirm(this.$t('release.alerts.leaveConfirm'))
      ) return;
      this.navigateOut();
    },
    navigateOut() {
      this.$router.push({ name: 'ReleasePage', params: { organizationId: this.orgId } });
    },

    getVal(fieldPath) {
      if (!fieldPath) return undefined;
      return getDeepVal(this.itemToEdit.releaseData, fieldPath);
    },
    setVal(val, fieldPath) {
      setDeepVal(this.itemToEdit.releaseData, fieldPath, val);
      this.itemToEdit.releaseData = {...this.itemToEdit.releaseData};
      this.$forceUpdate();
    }
  },
  async created() {
    await this.getOrg();
    // await this.loadReleaseDataFields();
    await this.getItem();
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    }
  },
  components: {
    DynamicInput,
    ReleaseDesignViewer,
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-edit {
    .form-content {
      padding: em(10px);
    }
    .dynamic-input:not(.input-field-SEPARATOR) h3 {
      width: em(150px);
    }
    h2, h3 {
      color: #0084D4;
    }
    footer {
      padding: em(10px);
      position: fixed; 
      width: 100%;
      bottom: 0;
      left: 0;
      height: em(50px);
      background-color: #E0E0E0;
      padding: em(10px);
    }
    main {
      margin-bottom: em(50px);
      padding: em(10px) 0;
    }
  }
}

</style>
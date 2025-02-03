<template>
  <div class="release-edit app-form-styling flex column gap20" v-if="itemToEdit && org">
    <!-- <header class="header tab-nav">
      <div class="container width-all">
        <button @click="showDesign = false" :class="{selected: !showDesign}">{{$t('releaseLocales.editRelease')}}</button>
        <button :disabled="!itemToEdit._id" @click="showDesign = true" :class="{selected: showDesign}">{{$t('releaseLocales.designAndPreview')}}</button>
      </div>
    </header> -->
    <main class="form-content container flex column gap30 width-all">
      <template v-if="!showDesign">
        <h2>{{$t(itemToEdit._id? 'releaseLocales.editRelease' : 'releaseLocales.createRelease')}} > {{selectedReleaseTypeItem?.name || ''}}</h2>
        <form v-if="itemToEdit" @submit.prevent="" class="flex column gap20">
          <FormInput class="gap30 locale-select" type="select" labelholder="locale" :itemsMap="{'english': 'en', 'עברית': 'he'}" v-model="itemToEdit.design.locale"/>
          <FormInput class="gap30 expiration-date" type="date" labelholder="releaseLocales.expirationDate" v-model="itemToEdit.expirationDate" format_="timeMS"/>
          <DynamicInput v-for="(dataField, idx) in dataFields" :key="idx" :dataField="dataField" :basePath="dataField.fieldName" :value="getVal(dataField.fieldName)" @input="(val, setPath, isForceUpdate) => setVal(val, setPath, isForceUpdate)" :release="itemToEdit" :parentItem="itemToEdit.releaseData" :organization="org"/>
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
      <div class="flex gap10 align-center space-between container height-all">
        <div>
          <button class="btn big" v-if="itemToEdit._id" @click="deleteItem">{{$t('delete')}}</button>
        </div>
        <div class="flex align-center gap30 height-all">
          <button class="btn big" @click="close">{{$t('close')}}</button>
          <template v-if="isScreenWide">
            <button class="btn big primary" :disabled="!isItemValid" @click="saveItemAndClose">{{$t('saveAndClose')}} <img :src="require('@/apps/megaphonApp/assets/images/save_white.svg')"/></button>
            <button class="btn big primary" :disabled="!isItemValid" @click="saveItem">{{$t('save')}} <img :src="require('@/apps/megaphonApp/assets/images/save_white.svg')"/></button>
          </template>
          <button v-else class="btn big primary" :disabled="!isItemValid" @click="saveItemAndClose">
            {{$t('save')}}
            <!-- <img :src="require('@/apps/megaphonApp/assets/images/save_white.svg')"/> -->
          </button>
          <button class="btn big primary" v-if="showDesign" @click="showDesign = false">{{$t('releaseLocales.editRelease')}}</button>
          <button class="btn big primary" v-if="!showDesign" :disabled="!itemToEdit._id" @click="showDesign = true" >{{$t('releaseLocales.designAndPreview')}}</button>
          
          <button v-if="isScreenWide" class="btn big primary" :disabled="!isItemValid" @click="confirmAndDistribute">{{$t('releaseLocales.confirmAndDistribute')}}</button>
          <button v-else class="btn big primary" :disabled="!isItemValid" @click="confirmAndDistribute">{{$t('distributeLocales.distribute')}}</button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { getDeepVal, setDeepVal } from '../../../../common/modules/common/services/util.service';
import DynamicInput from '../cmps/DynamicFormInputs/DynamicInput.vue';
import { createItemForDynamicForm } from '../../common/services/dynamicFormService';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import ReleaseDesignViewer from '../cmps/ReleaseDesignViewer.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { elementService } from '../../../../common/modules/common/services/element.service';
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
    queryReleaseType() {
      return this.$route.query.releaseType;
    },
    releaseType() {
      return this.itemToEdit?.releaseType || this.queryReleaseType || '';
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

    isScreenWide() {
      return this.$store.getters.isScreenWide;
    }
  },
  methods: {
    async loadReleaseDataFields() {
      this.dataFields = (await this.$store.dispatch({ type: 'organization/loadReleaseDataFields', dataFieldsLocalFilePath: this.selectedReleaseTypeItem?.dataFieldsLocalFilePath, organizationId: this.orgId, releaseType: this.releaseType })).filter(c => !c.disabled);
    },
    async getOrg() {
      this.org = await this.$store.dispatch({ type: 'organization/loadItem', id: this.orgId, isToInheritData: true });
    },
    async getItem() {
      this.dataFields = [];
      this.itemToEdit = null;
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
      // if (
      //   this.didChange && 
      //   !await alertService.Confirm(this.$t('releaseLocales.alerts.leaveConfirm'))
      // ) return;
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
    },


    onFileUploaded(file) {
      // delete file.src;
      // if (this.itemToEdit._id) return;
      if (!this.itemToEdit.__newFiles__) this.itemToEdit.__newFiles__ = [];
      this.itemToEdit.__newFiles__.push(file);
    }
  },
  mounted() {
    setTimeout(() => {
      window.scroll(0, 0);
    }, 300);
  },
  async created() {
    await this.getOrg();
    // await this.loadReleaseDataFields();
    await this.getItem();
    evManager.on('file-uploaded', this.onFileUploaded);
  },
  destroyed() {
    evManager.off('file-uploaded', this.onFileUploaded);
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    },
    queryReleaseType() {
      this.getItem();
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.didChange) return next();
    const doesWantToLeave = await alertService.Confirm(this.$t('releaseLocales.alerts.leaveConfirm'), undefined, '<style>.A-Alert .alert-modal .a-alert-confirm-btn {border: none !important; box-shadow: none !important;}</style>');
    if (!doesWantToLeave) return next(false);
    else return next(true);
  },
  components: {
    DynamicInput,
    ReleaseDesignViewer,
    FormInput,
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-edit {
    padding-top: rem(20px);
    .form-content {
      padding: em(10px);
    }
    .dynamic-input:not(.input-field-SEPARATOR) h3 {
      width: em(150px);
      font-size: em(16px);
      font-weight: normal;
    }

    .form-input {
      &-text, &-select, &-date {
        height: em(40px);
        input {
          border-radius: 0;
        }
      }
    }

    .locale-select, .expiration-date {
      p {
        width: em(100px);
        color: var(--clr-0);
      }
    }

    // h2, h3 {
    //   color: #0084D4;
    // }
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
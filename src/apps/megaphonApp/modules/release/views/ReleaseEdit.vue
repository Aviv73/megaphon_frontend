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
        <h2>{{$t(itemToEdit._id? 'release.editRelease' : 'release.createRelease')}} > {{selectedReleaseTemplate?.name || ''}}</h2>
        <form v-if="itemToEdit" @submit.prevent="" class="flex column gap20">
          <DynamicInput v-for="(dataField, idx) in dataFields" :key="idx" :dataField="dataField" :basePath="dataField.fieldName" :value="getVal(dataField.fieldName)" @input="(val, setPath, isForceUpdate) => setVal(val, setPath, isForceUpdate)" :parentItem="itemToEdit.releaseData" :organization="org"/>
        </form>
      </template>
      <template v-else>
        <div class="tab-nav light width-all flex gap10 align-end">
          <button @click="selectedDesignTypeToShow = '0'" :class="{selected: selectedDesignTypeToShow === '0'}" :disabled="!itemToEdit._id">{{$t('release.landingPageDesign')}}</button>
          <button @click="selectedDesignTypeToShow = '1'" :class="{selected: selectedDesignTypeToShow === '1'}">{{$t('release.newsletterDesign')}}</button>
        </div>
        <div class="width-all flex column align-center gap10">
          <ToggleBtns v-model="previewPlatform" :options="[
            {value: 'desktop', img: require('@/apps/megaphonApp/assets/images/devices/desktop.jpg')},
            {value: 'tablet', img: require('@/apps/megaphonApp/assets/images/devices/tablet.jpg')},
            {value: 'mobile', img: require('@/apps/megaphonApp/assets/images/devices/mobile.png')},
          ]"/>
          <FormInput 
            type="select"
            v-model="itemToEdit.design[selectedDesignTypeToShow == 0? 'landingPage' : 'email']"
            @change="saveItem"
            :items="
              org.templates
                .filter(c => c.releaseTypes.includes(itemToEdit.releaseType))
                .filter(c => c.type == selectedDesignTypeToShow)
                .map(c => ({ label: c.name, value: c.id }))
            "
          />
          <iframe v-if="landingPageUrl" :style="iframeStyle" :src="landingPageUrl" frameborder="0"></iframe>
          <p v-else>{{$t('noMatchingDesign')}}</p>
        </div>
      </template>
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
import { getReleaseLandingPageUrl, getReleaseRelevantTemplate } from '../../common/services/template.util.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';
import ToggleBtns from '../../../../common/modules/common/cmps/ToggleBtns.vue';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
export default {
  name: 'ReleaseEdit',
  data() {
    return {
      itemToEdit: null,
      initialItem: null,
      org: null,
      showDesign: false,
      selectedDesignTypeToShow: '0',
      previewPlatform: 'desktop', // / tablet / mobile

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

    selectedReleaseTemplate() {
      if (!this.org || !this.releaseType) return null;
      return this.org.releaseTypes.find(c => c.id === this.releaseType);
    },
    // dataFields() {
    //   if (!this.selectedReleaseTemplate) return []
    //   const dataFields = JSON.parse(this.selectedReleaseTemplate.dataFieldsStr);
    //   return dataFields;
    // },

    designsOpts() {
      if (!this.org) return [];
      const templates = getReleaseRelevantTemplate(this.itemToEdit, this.org, this.selectedDesignTypeToShow === '1');
      return templates;
    },
    landingPageUrl() {
      // console.log(this.selectedDesignTypeToShow, typeof (this.selectedDesignTypeToShow));
      console.log(getReleaseLandingPageUrl(this.itemToEdit, this.org, this.selectedDesignTypeToShow === '1'))
      return getReleaseLandingPageUrl(this.itemToEdit, this.org, this.selectedDesignTypeToShow === '1');
    },

    iframeStyle() {
      switch ( this.previewPlatform) {
        case 'desktop': 
          return { width: '100%', height: '700px' }
        case 'tablet': 
          return { width: '50%', height: '700px' }
        case 'mobile': 
          return { width: '400px', height: '700px' }
      }
    },

    didChange() {
      return JSON.stringify(this.itemToEdit) !== JSON.stringify(this.initialItem);
    }
  },
  methods: {
    async loadDataFields() {
      this.dataFields = await this.$store.dispatch({ type: 'organization/loadDataFields', dataFieldsLocalFilePath: this.selectedReleaseTemplate?.dataFieldsLocalFilePath, organizationId: this.orgId, releaseType: this.releaseType });
    },
    async getOrg() {
      this.org = await this.$store.dispatch({ type: 'organization/loadItem', id: this.orgId });
    },
    async getItem() {
      this.itemToEdit = await this.$store.dispatch({ type: 'release/loadItem', id: this.$route.params.id });
      await this.loadDataFields();
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
    // await this.loadDataFields();
    await this.getItem();
  },
  watch: {
    '$route.params.id'() {
      this.getItem();
    }
  },
  components: {
    DynamicInput,
    ToggleBtns,
    FormInput,
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
    .tab-nav {
      width: 100%;
      height: em(60px);
      background-color: #0084D4;
      padding: 0 em(10px);
      .container {
        height: 100%;
        display: flex;
        align-items: flex-end;
        gap: em(10px);
      }
      button {
        height: 80%;
        padding: em(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #B2DAF2;
        color: #0084D4;
        &.selected {
          background-color: #fff;
        }
      }
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
  iframe {
    background-color: #fff;
  }
  .toggle-btns {
    background-color: #fff;
  }
}

</style>
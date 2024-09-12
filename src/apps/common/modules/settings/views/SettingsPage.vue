<template>
  <div class="settings-page flex column gap10 main-pad-y">
    <h2>{{$t('settings.settings')}}</h2>
    <!-- <pre>{{settings}}</pre>
    <form @submit.prevent="saveSettings">
      <FormInput label="Google API key" v-model="settings.GOOGLE_API_KEY"/>
      <button>{{$t('save')}}</button>
    </form> -->
    <div class="simple-form">
      <!-- <FormInput type="select" class="gap10" labelholder="settings.locale" v-model="uiConfig.locale" :items="langs"/> -->
      <!-- <FormInput type="select" class="gap10" labelholder="settings.theme" v-model="uiConfig.theme" :items="themes"/> -->
      <FormInput type="select" class="gap10" labelholder="settings.textSize" v-model="uiConfig.remSize" :items="remOpts"/>
      <!-- <FormInput class="gap10 row-reverse" label="settings.darkMode" :value="uiConfig.darkMode" type="checkbox" @input="setDarkMode"/> -->
      <!-- <FormInput type="checkbox" class="gap10" label="settings.accessability" v-model="uiConfig.accessabilityMode"/> -->
    </div>
  </div>
</template>

<script>
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import evEmmiter from '@/apps/common/modules/common/services/event-emmiter.service';

export default {
  name: 'SettingsPage',
  data() {
    return {
      langs: [{value: 'en', label: 'english'}, {value: 'he', label: 'hebrew'}],
      themes: ['default', 'dark'].map(c => ({value: c, label: `settings.themes.${c}`})),
      remOpts: [{label: 'Small', value: 12}, {label: 'Medium', value: 15}, {label: 'Big', value: 17}, {label: 'Bigger', value: 20}].map(c => ({...c, label: `settings.textSize${c.label}`})),
      settings: null,
      uiConfig: {...this.$store.getters['settings/uiConfig']},
    }
  },
  computed: {
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  methods: {
    saveUiConfig() {
      this.$store.dispatch({ type: 'settings/saveUiConfig', config: this.uiConfig });
      evEmmiter.emit('app_config_update', this.uiConfig);
    },
    async saveSettings() {
      const updatedSettings = await this.$store.dispatch({ type: 'settings/updateSettings', settings: this.settings });
      this.settings = JSON.parse(JSON.stringify(updatedSettings));
    }
  },
  created() {
    this.settings = JSON.parse(JSON.stringify(this.$store.getters['settings/settings']));
  },
  watch: {
    uiConfig: {
      deep: true,
      handler() {
        this.saveUiConfig();
      }
    }
  },
  components: { FormInput }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.settings-page {
  .simple-form {
    .form-input {
      width: em(300px);
    }
  }
}
</style>
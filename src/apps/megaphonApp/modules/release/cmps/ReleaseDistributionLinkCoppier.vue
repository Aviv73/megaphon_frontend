<template>
  <div class="release-distribution-link-coppier">
    <ToggleModal :fullScreen="true">
      <template #toggler>
        <button class="btn">
          {{$t('distributeLocales.copyReleaseDistributionUrl')}}
          <img class="ico-img" :src="require('@/assets/images/icons/url.png')" alt="">
        </button>
      </template>
      <template #content>
        <div class="simple-form">
          <h3>{{$t('distributeLocales.copyReleaseDistributionUrl')}}</h3>
          <FormInput type="select" v-model="origin" labelholder="origin" :items="originOpts"/>
          <FormInput type="select" v-model="tokenType" labelholder="distributeLocales.tokenType" :items="tokenOpts.map(c => ({value: c, label: `distributeLocales.tokenTypes.${c}`}))"/>
          <FormInput v-if="tokenType === 'insert'" type="text" v-model="token" labelholder="distributeLocales.token"/>
          <p v-if="organization.requireAuth" class="bold">{{$t('distributeLocales.onlyRegularDistributionValidMsg')}}</p>
          <p class="note-p">{{$t('distributeLocales.uniqueTokenNote')}}</p>
          <p class="note-p">{{$t('distributeLocales.urlDistributionNote')}}</p>
          <p class="url-p">{{sendInEmailUrl}}</p>
          <button v-if="tokenType === 'unique'" class="btn" @click="regenerate">
            {{$t('distributeLocales.regenerateToken')}}
          </button>
          <button class="btn" @click="copyUrlToClipboard">
            {{$t('copy')}}
            <img class="ico-img" :src="require('@/assets/images/icons/url.png')" alt="">
          </button>
        </div>
      </template>
    </ToggleModal>
  </div>
</template>

<script>
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';
import ToggleModal from '../../../../common/modules/common/cmps/ToggleModal.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import { copyToClipBoard, getRandomId } from '../../../../common/modules/common/services/util.service';
import { alertService } from '@/apps/common/modules/common/services/alert.service';

import config from '@/config';

export default {
  components: { ToggleModal, FormInput },
  name: 'ReleaseDistributionLinkCoppier',
  props: {
    release: {
      type: Object
    },
    organization: {
      type: Object
    }
  },
  data() {
    return {
      origin: 'email',
      token: '',
      originOpts: ['email', 'site'],
      // tokenOpts: ['unique', 'insert', 'none'],
      tokenOpts: ['unique', 'insert'],
      tokenType: 'unique',
      randomToken: getRandomId(''),
    }
  },
  computed: {
    sendInEmailUrl() {
      // this.token === 'random'? getRandomId('') : this.token
      // &token=${getRandomId('')}
      const _token = this.tokenType === 'unique'? this.randomToken : this.tokenType === 'none'? '' : this.token;
      return templateUtils.getReleaseLandingPageUrl(this.release, this.organization, 'landingPage', config) + 
          `?releaseId=${this.release?._id}&origin=${this.origin}&token=${_token}`;
    }
  },
  methods: {
    copyUrlToClipboard() {
      if ((this.tokenType === 'insert') && !this.token) return alertService.toast({ msg: this.$t(`missingFields`), type: 'danger' });
      copyToClipBoard(this.sendInEmailUrl);
      alertService.toast({ msg: this.$t(`copiedToClipboard`), type: 'safe' });
    },
    regenerate() {
      this.randomToken = getRandomId('');
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.release-distribution-link-coppier {
  // label {
  //   width: em(100px);
  // }
  .note-p, .url-p {
    max-width: em(500px);
  }
  .url-p, {
    direction: ltr;
    word-break: break-all;
    padding: em(5px);
    border-radius: em(3px);
    border: 1px solid gray;
  }
  .blur {
    display: none;
  }
}
</style>
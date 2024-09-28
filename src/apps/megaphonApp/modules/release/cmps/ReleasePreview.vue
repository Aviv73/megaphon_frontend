<template>
  <component :is="isProducer? 'DragDiv' : 'div'" class="preview-container" :onDrag="() => toggleToSelectedReleases(true)">
    <li class="release-preview flex column gap5" :class="{ selected_: selectedReleaseIds.includes(item._id) }" @click="handleClick">
      <img class="release-img" :src="imgSrc" :alt="release.title" loading="lazy">
      <p class="dist-title align-self-end_" v-if="item.distributedAt">{{$t('release.distributedAt')}}: {{pretyDistributionTime}}</p>
      <p class="release-title">{{release.title}}</p>
      <div class="actions flex column align-end gap5" v-if="!isUserOrgWatchOnly">
        <button v-if="isProducer" @click.stop="goToLandingPage"><div class="img" v-html="actionSvgs.eye"></div></button>
        <router-link v-if="isProducer" @click.stop="" :to="{ name: 'ReleaseEdit', params: { organizationId: item.organizationId, id: item._id } }" ><div class="img" v-html="actionSvgs.pencil"></div></router-link>
        <!-- <router-link v-if="item.distributedAt" :to="{ name: 'ReleaseReport', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/stats.svg')" alt=""></router-link> -->
        <router-link v-if="isRoleInOrg('admin')" :to="{ name: 'ReleaseReport', params: { organizationId: item.organizationId, id: item._id } }" ><div class="img" v-html="actionSvgs.stats"></div></router-link>
        <router-link v-if="isProducer" @click.stop="" :to="{ name: 'ReleaseDistribution', params: { organizationId: item.organizationId, id: item._id } }" ><div class="img" v-html="actionSvgs.distribute"></div></router-link>
        <!-- <FormInput v-if="isProducer" type="checkbox" v-model="isSelected" @click.native.stop.prevent="val => toggleToSelectedReleases(false)"/> -->
      </div>
    </li>
  </component>
</template>

<script>
import DragDiv from '../../common/cmps/dnd/DragDiv.vue';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { fixFileSrcToThumbnail } from '../../../../common/modules/common/services/file.service';
import { organizationService } from '../../organization/services/organization.service';

import  { getSvgs } from '../../../assets/images/svgs.js';

import config from '@/config';
import FormInput from '../../../../common/modules/common/cmps/FormInput.vue';

export default {
  components: { DragDiv, FormInput },
  name: 'ReleasePreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String],
    selectedReleaseIds: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isSelected: false
    }
  },
  created() {
    this.isSelected = selectedReleaseIds.includes(item._id);
  },
  computed: {
    // isAdmin() {
    //   return organizationService.isUserRoleInOrg(this.organization._id, 'admin', this.loggedUser);
    //   // return this.$store.getters['auth/isAdmin'];
    // },
    isProducer() {
      return this.isRoleInOrg('producer');
    },
    release() {
      return this.item.releaseData
    },
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    imgSrc() {
      return fixFileSrcToThumbnail(this.release.mainImage, this.item) ? fixFileSrcToThumbnail(this.release.mainImage, this.item) : require('@/apps/megaphonApp/assets/images/image_placeholder.png');
    },

    pretyDistributionTime() {
      if (!this.item.distributedAt) return '';
      const time = new Date(this.item.distributedAt);
      return `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    },
    isUserOrgWatchOnly() {
      // return this.$store.getters['auth/isWatchOnly'];
      return organizationService.isUserWatchOnly(this.organization?._id, this.loggedUser);
    },
    
    selectedTheme() {
      return this.$store.getters['selectedTheme'];
    },

    actionSvgs() {
      const clr = this.selectedTheme?.colors?.[4] || 'black';
      return getSvgs(clr).PreviewActions; 
    }
  },
  methods: {
    isRoleInOrg(role) {
      return organizationService.isUserRoleInOrg(this.organization?._id, role, this.loggedUser);
    },
    goToLandingPage() {
      const pageUrl = templateUtils.getReleaseLandingPageUrl(this.item, this.organization, 'landingPage', config);
      window.open(pageUrl);
    },
    toggleToSelectedReleases(isDraging = false) {
      evManager.emit('toggleRelease-from-selected', this.item._id, isDraging);
    },

    handleClick() {
      return this.goToLandingPage();
      if (!this.$store.getters.isScreenWide || this.isUserOrgWatchOnly) return this.goToLandingPage();
      this.isProducer? this.toggleToSelectedReleases(false) : this.goToLandingPage();
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .preview-container {
    @media (max-width: $small-screen-breake) {
      width: 100%;
    }
  }
  .release-preview {
    color: var(--clr-0);
    position: relative;
    // width: em(180px);
    @media (max-width: $small-screen-breake) {
      // width: 90vw;
      width: 100%;
    }
    cursor: pointer;
    .release-img {
      // height: em(130px);
      height: em(160px);
      width: 100%;
      object-fit: cover;
      @media (max-width: $small-screen-breake) {
        height: em(200px);
      }
    }
    .dist-title {
      font-size: em(12px);
    }
    p.release-title {
      word-wrap: break-word;
      font-size: em(16px);
    }

    .actions {
      position: absolute;
      top: em(10px);
      left: em(10px);
      color: var(--clr-4);
      a, button, .form-input-checkbox input {
        background-color: var(--clr-1);
        box-shadow: $light-shadow;
        width: em(17px) !important;
        height: em(17px) !important;
        @media (max-width: $small-screen-breake) {
          width: em(30px);
          height: em(30px);
        }
        img, .img {
          width: 100%;
          height: 100%;
          color: var(--clr-4);
        }
      }
    }

    &.selected {
      outline: em(3px) solid #2771A4;
    }
  }
}
</style>
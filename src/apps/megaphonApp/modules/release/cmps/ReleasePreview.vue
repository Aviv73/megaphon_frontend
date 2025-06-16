<template>
  <component :is="isProducer && false? 'DragDiv' : 'div'" class="preview-container" :onDrag="() => toggleToSelectedReleases(true)">
    <li class="release-preview flex column gap5" :class="{ selected_: selectedReleaseIds.includes(item._id) }" @click="handleClick">
      <img class="release-img" :src="imgSrc" :alt="release.title" loading="lazy">
      <p class="release-title">{{release.title}}</p>
        <!-- <p class="dist-title align-self-end_" v-if="item.distributedAt">{{$t('releaseLocales.distributedAt')}}: {{pretyDistributionTime}}</p> -->
      <div v-if="!isUserOrgWatchOnly && !reportMode" class="actions-container flex column space-between align-end gap7 height-all">
        <div class="actions flex column align-end gap5 space-between flex-1">
          <button :title="$t('watch')" class="hover-pop" v-if="isProducer" @click.stop="goToLandingPage"><div class="img" v-html="actionSvgs.eye"></div></button>
          <router-link :title="$t('edit')" class="hover-pop" v-if="isProducer" @click.stop="" :to="{ name: 'ReleaseEdit', params: { organizationId: item.organizationId, id: item._id } }" ><div class="img" v-html="actionSvgs.pencil"></div></router-link>
          <!-- <router-link v-if="item.distributedAt" :to="{ name: 'ReleaseReport', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/stats.svg')" alt=""></router-link> -->
          <router-link :title="$t('statsLocales.stat')" class="hover-pop" v-if="isRoleInOrg('admin')" :to="{ name: 'ReleaseReport', params: { organizationId: item.organizationId, id: item._id } }" ><div class="img" v-html="actionSvgs.stats"></div></router-link>
          <router-link :title="$t('distributeLocales.distributeRelease')" class="hover-pop" v-if="isProducer" @click.stop="" :to="{ name: 'ReleaseDistribution', params: { organizationId: item.organizationId, id: item._id } }" ><div class="img" v-html="actionSvgs.distribute"></div></router-link>
          <p class="dist-title align-self-end_" v-if="item.distributedAt || true">{{pretyDistributionTime}}</p>
        </div>
        <!-- <FormInput class="select-checkbox" v-if="isProducer" type="checkbox" v-model="isSelected" @click.native.stop="val => toggleToSelectedReleases(false)"/> -->
        <!--   -->
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
import { Utils } from '../../../../common/modules/common/services/util.service';

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
    },
    reportMode: {
      type: Boolean,
      required: false
    },
  },
  data() {
    return {
      isSelected: false
    }
  },
  created() {
    this.isSelected = this.selectedReleaseIds.includes(this.item._id);
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
      return Utils.Time.getTimeStrAs(this.item.distributedAt, 'date/month/year');
      // const time = new Date(this.item.distributedAt);
      // return `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
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
      if (this.reportMode) {
        this.$router.push({ name: 'ReleaseReport', params: { organizationId: this.item.organizationId, id: this.item._id } })
        return;
      }
      const pageUrl = templateUtils.getReleaseLandingPageUrl(this.item, this.organization, 'landingPage', config, window.location.pathname);
      window.open(pageUrl);
    },
    toggleToSelectedReleases(isDraging = false) {
      // this.isSelected = !this.isSelected;
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
    @media (max-width: $small-screen-break) {
      width: 100%;
    }
  }
  .release-preview {
    color: var(--clr-0);
    position: relative;
    // width: em(180px);
    @media (max-width: $small-screen-break) {
      // width: 90vw;
      width: 100%;
    }
    --height: #{em(160px)};
    --btn-size: #{em(33px)};
    cursor: pointer;
    .release-img {
      // height: em(130px);
      height: var(--height);
      width: 100%;
      // aspect-ratio: 3 / 2;
      object-fit: cover;
    }
    @media (max-width: $small-screen-break) {
      // height: em(200px);
      --height: #{em(200px)} !important;
    }
    .dist-title {
      font-size: em(12px);
    }
    p.release-title {
      word-wrap: break-word;
      font-size: em(16px);
    }

    .actions-container {
      position: absolute;
      // top: em(10px);
      // left: em(10px);
      padding: em(6px);

      top: 0;
      left: 0;
      height: var(--height);
      // @media (max-width: $small-screen-break) {
      //   height: em(200px);
      // }
      width: 100%;
      .dist-title {
        position: relative;
        z-index: 1;
        padding: em(3px);
        color: white;
        font-size: em(14px);
        height: var(--btn-size) !important;
        display: flex;
        align-items: flex-end;
        // background-color: rgba(0, 0, 0, 0.3);
        // background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
      }
      .actions {
        position: relative;
        z-index: 1;
        color: var(--clr-4);
        a, button, .form-input-checkbox_, .form-input-checkbox .input {
          &:not(.input) {
            background-color: var(--clr-1);
          }
          box-shadow: $light-shadow;
          // width: var(--btn-size) !important;
          aspect-ratio: 1 / 1;
          height: var(--btn-size) !important;
          @media (max-width: $small-screen-break) {
            // width: em(30px) !important;
            // height: em(30px) !important;
            // --btn-size: #{em(30px)} !important;
          }
          img, .img {
            width: 100%;
            height: 100%;
            color: var(--clr-4);
          }
        }
      }
      &::after {
        content: "";
        position: absolute;
        z-index: 0;
        bottom: 0;
        width: 100%;
        height: 30%;
        bottom: 0;
        left: 0;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));
      }
    }

    .select-checkbox {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }

    &.selected {
      outline: em(3px) solid #2771A4;
    }

    
  }
}
</style>
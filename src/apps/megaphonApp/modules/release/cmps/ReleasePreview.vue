<template>
  <component :is="isProducer? 'DragDiv' : 'div'" :onDrag="() => toggleToSelectedReleases(true)">
    <li class="release-preview flex column gap5" :class="{ selected: selectedReleaseIds.includes(item._id) }" @click="handleClick">
      <img class="release-img" :src="imgSrc" :alt="release.title" loading="lazy">
      <p class="release-title" v-if="item.distributedAt">{{$t('release.distributedAt')}}: {{pretyDistributionTime}}</p>
      <p class="release-title">{{release.title}}</p>
      <div class="actions flex column gap5">
        <button @click.stop="goToLandingPage"><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/eye.svg')" alt=""></button>
        <router-link v-if="isProducer" @click.stop="" :to="{ name: 'ReleaseEdit', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/pencil.svg')" alt=""></router-link>
        <!-- <router-link v-if="item.distributedAt" :to="{ name: 'ReleaseReport', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/stats.svg')" alt=""></router-link> -->
        <router-link v-if="isRoleInOrg('admin')" :to="{ name: 'ReleaseReport', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/stats.svg')" alt=""></router-link>
        <router-link v-if="isProducer" @click.stop="" :to="{ name: 'ReleaseDistribution', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/distribute.svg')" alt=""></router-link>
      </div>
    </li>
  </component>
</template>

<script>
import DragDiv from '../../common/cmps/dnd/DragDiv.vue';
import { templateUtils } from '../../common/services/template.util.service';
import evManager from '@/apps/common/modules/common/services/event-emmiter.service.js';
import { fixFileSrcToThumbnail } from '../../../../common/modules/common/services/file.service';
import { organizationService } from '../../organization/services/organization.service';
export default {
  components: { DragDiv },
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
      return fixFileSrcToThumbnail(this.release.mainImage?.[0]?.src || this.release.mainImage?.src || require('@/apps/megaphonApp/assets/images/image_placeholder.png'));
    },

    pretyDistributionTime() {
      if (!this.item.distributedAt) return '';
      const time = new Date(this.item.distributedAt);
      return `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  methods: {
    isRoleInOrg(role) {
      return organizationService.isUserRoleInOrg(this.organization?._id, role, this.loggedUser);
    },
    goToLandingPage() {
      const pageUrl = templateUtils.getReleaseLandingPageUrl(this.item, this.organization, false);
      window.open(pageUrl);
    },
    toggleToSelectedReleases(isDraging) {
      evManager.emit('toggleRelease-from-selected', this.item._id, isDraging);
    },

    handleClick() {
      if (!this.$store.getters.isScreenWide) return this.goToLandingPage();
      this.isProducer? this.toggleToSelectedReleases(false) : this.goToLandingPage();
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-preview {
    position: relative;
    width: em(180px);
    @media (max-width: $small-screen-breake) {
      width: 90vw;
    }
    cursor: pointer;
    .release-img {
      height: em(130px);
      width: 100%;
      object-fit: cover;
      @media (max-width: $small-screen-breake) {
        height: em(200px);
      }
    }
    p.release-title {
      word-wrap: break-word;
      font-size: em(12px);
    }

    .actions {
      position: absolute;
      top: em(10px);
      left: em(10px);
      a, button {
        background-color: #fff;
        width: em(17px);
        height: em(17px);
        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    &.selected {
      outline: em(3px) solid #2771A4;
    }
  }
}
</style>
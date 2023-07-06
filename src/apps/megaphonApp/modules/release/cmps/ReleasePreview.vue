<template>
  <li class="release-preview">
    <img class="release-img" :src="imgSrc" alt="">
    <p>{{release.title}}</p>
    <div class="actions flex column gap5">
      <button @click="goToLandingPage"><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/eye.svg')" alt=""></button>
      <router-link :to="{ name: 'ReleaseEdit', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/pencil.svg')" alt=""></router-link>
      <!-- <router-link :to="{ name: 'ReleaseStats', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/stats.svg')" alt=""></router-link> -->
      <router-link :to="{ name: 'ReleaseDistirbution', params: { organizationId: item.organizationId, id: item._id } }" ><img :src="require('@/apps/megaphonApp/assets/images/PreviewActions/distribute.svg')" alt=""></router-link>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ItemPreview',
  props: {
    item: {
      type: Object,
      required: true
    },
    itemDetailesPageName: [String]
  },
  computed: {
    organization() {
      return this.$store.getters['organization/selectedItem'];
    },
    release() {
      return this.item.releaseData
    },
    imgSrc() {
      return this.release.mainImage?.[0]?.src || require('@/apps/megaphonApp/assets/images/image_placeholder.png');
    }
  },
  methods: {
    goToLandingPage() {
      const template = this.organization.templates.filter(c => c.type == '0').find(c => c.releaseTypes.includes(this.item.releaseType));
      let pageUrl = template.url;
      pageUrl = pageUrl.split('${releaseId}').join(this.item._id);
      window.open(pageUrl);
    }
  }
}
</script>

<style lang="scss">
.megaphon-app {
  .release-preview {
    position: relative;
    width: 150px;
    .release-img {
      height: 100px;
      width: 100%;
      object-fit: cover;
    }

    .actions {
      position: absolute;
      top: 10px;
      left: 10px;
      a, button {
        background-color: #fff;
        width: 15px;
        height: 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
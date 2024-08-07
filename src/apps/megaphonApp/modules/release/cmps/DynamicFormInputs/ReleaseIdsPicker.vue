<template>
  <div class="release-ids-peacker flex column align-start gap10">
    <ul class="release-list flex column gap10">
      <li v-for="(release) in releases" :key="release._id" class="flex align-end gap10">
        <FormInput type="checkbox" :value="val.includes(release._id)" @change="val => toggleRelease(release._id, val)"/>
        <p>{{release.releaseData?.title}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import Modal from '@/apps/common/modules/common/cmps/Modal.vue';
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
export default {
  components: { Modal, FormInput },
  name: 'ReleaseIdsPicker',
  props: {
    value: null,
    dataField: [Object],
    // releases: [Array],
    parentItem: [Object],
    fromField: null
  },
  data() {
    return {
      val: [...(this.value || [])]
    }
  },
  computed: {
    releases() {
      return this.parentItem?.[this.fromField] || [];
    }
  },
  methods: {
    toggleRelease(releaseId, toggleVal) {
      const idx = this.val.indexOf(releaseId);
      if (idx === -1) this.val.push(releaseId);
      else this.val.splice(idx, 1);
      this.$emit('input', [...this.val]);
    }
  },
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-ids-peacker {
    .release-img {
      width: em(150px);
      height: em(100px);
      object-fit: contain;
      border: em(1px) solid var(--clr-0);
    }

    .search-modal {
      .modal {
        height: 50vh;
        max-height: 50vh;
        width: 50vw;
        .search-modal-content {
          height: 100%;
          ul {
            height: 80%;
            max-height: 80%;
            overflow: auto;
          }
        }
      }
    }

    .release-select-list {
      position: relative;
      margin-bottom: em(50px);
    }
    footer {
      height: em(50px);
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
<template>
  <div class="release-peacker flex column align-start gap10">
    <ul class="release-list flex column gap10">
      <li v-for="(release, idx) in value" :key="release._id" class="flex align-end gap10">
        <img class="release-img" :src="release.releaseData?.mainImage?.[0]?.src || ''" :alt="release.releaseData?.title" />
        <p>{{release.releaseData?.title}}</p>
        
        <TableActionBtns v-model="organizationToEdit.value" :idx="idx"/>
      </li>
    </ul>
    <button class="btn big" @click="showSearchModal = true">{{$t('add')}}</button>
    <Modal class="search-modal" v-if="showSearchModal" @close="showSearchModal = false" :fullScreen="true">
      <div class="search-modal-content flex column gap10">
        <p>{{$t('release.searchReleases')}}</p>
        <form @submit.prevent="getReleases" class="flex space-between gap5">
          <FormInput placeholder="release.searchReleases" v-model="releasesFilterBy.filter.search"/>
          <button :disabled="releasesFilterBy.filter.search.length < 2 && false" class="btn">{{$t('search')}}</button>
        </form>
        <ul class="release-select-list flex column gap20 flex-1" v-if="releases?.length">
          <li v-for="(release) in releases" :key="release._id" class="flex align-end gap10">
            <img class="release-img" :src="release.releaseData?.mainImage?.[0]?.src || ''" :alt="release.releaseData?.title" />
            <p>{{release.releaseData?.title}}</p>
            <input type="checkbox" v-model="releasesToAdd" :value="release"/>
          </li>
        </ul>
        <p v-else-if="showMsg">{{$t('noItemsFound')}}</p>
        <footer class="flex align-center justify-center gap50">
          <button class="btn big" @click="showSearchModal = false">{{$t('cancel')}}</button>
          <button class="btn big" @click="addReleases">{{$t('add')}}</button>
        </footer>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from '@/apps/common/modules/common/cmps/Modal.vue';
import FormInput from '@/apps/common/modules/common/cmps/FormInput.vue';
import { releaseService } from '@/apps/common/modules/release/services/release.service.js'
import TableActionBtns from '../../../../../common/modules/common/cmps/TableActionBtns.vue';
export default {
  components: { Modal, FormInput, TableActionBtns },
  name: 'ReleasePicker',
  props: {
    value: [Array],
    dataField: [Object],
    organization: [Object],
  },
  data() {
    return  {
      showSearchModal: false,
      releasesFilterBy: {
        filter: {
          search: '',
        },
        orgFilter: {
          releaseTypes: this.dataField.filter?.length? this.dataField.filter : undefined,
          wasDistributed : false
        }
        // orgFilter: this.organization.filters?.find(c => c._id === this.dataField.filter)
      },
      releases: [],
      showMsg: false,
      releasesToAdd: []
    }
  },
  methods: {
    async getReleases() {
      const releasesRes = await releaseService.query(this.releasesFilterBy, this.$route.params.organizationId);
      this.releases = releasesRes.items.filter(c => !this.value.find(rel => rel._id === c._id));
      this.showMsg = true;
    },
    addReleases() {
      this.$emit('input', [...this.value, ...this.releasesToAdd]);
      this.releasesToAdd = [];
      this.showSearchModal = false;
    },
  },

  created() {
    this.getReleases();
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .release-peacker {
    .release-img {
      width: em(150px);
      height: em(100px);
      object-fit: contain;
      border: em(1px) solid black;
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
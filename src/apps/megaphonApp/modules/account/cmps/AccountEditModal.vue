<template>
  <Modal class="account-edit-modal" :showCloseBtn="true" :fullScreen="true" @close="close"> 
    <AccountEdit :isNested="true"/>
  </Modal>
</template>

<script>
import AccountEdit from '../views/AccountEdit.vue'
import Modal from '@/apps/common/modules/common/cmps/Modal.vue';
export default {
  name: 'AccountEditModal',
  components: {
    Modal,
    AccountEdit
  },
  methods: {
    close() {
      // $router.back()
      this.$router.push({ name: this.$route.matched[this.$route.matched.length-2]?.name, params: { organizationId: this.$route.params.organizationId } })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.account-edit-modal {
  .modal {
    width: em(500px);
    max-width: 95vw;
    background: radial-gradient(circle at 100% 100%, #ffffff 0, #ffffff 3px, transparent 3px) 0% 0%/5px 5px no-repeat,
                    radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 3px, transparent 3px) 100% 0%/5px 5px no-repeat,
                    radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 3px, transparent 3px) 0% 100%/5px 5px no-repeat,
                    radial-gradient(circle at 0 0, #ffffff 0, #ffffff 3px, transparent 3px) 100% 100%/5px 5px no-repeat,
                    linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 4px) calc(100% - 10px) no-repeat,
                    linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 10px) calc(100% - 4px) no-repeat,
                    linear-gradient(90deg, #ff0000 50%, #ff00d7 100%) 90% 17%/181% 119%;
  }
}
</style>
<template>
  <Modal :fullScreen="true" @close="$router.back()">
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
  }
}
</script>
<template>
  <div class="organization-app container inner-app flex column gap20">
    <nav v-if="orgId" class="flex align-center gap10">
      <router-link :to="{name: 'PostPage', params: {organizationId: orgId} }">{{$t('post.posts')}}</router-link>
      <router-link :to="{name: 'ShoppingListPage', params: {organizationId: orgId} }">{{$t('shoppingList.shoppingLists')}}</router-link>
    </nav>
    <router-view class="inner-app-content"/>
    <Loader v-if="isLoading"/>
  </div>
</template>


<script>
import Loader from '@/modules/common/cmps/Loader.vue';
export default {
  name: 'OrganizationsApp',
  computed: {
    isLoading() {
      return this.$store.getters['organization/isLoading'];
    },
    orgId() {
      return this.$route.params.id;
    }
  },
  components: {
    Loader
  }
}
</script>
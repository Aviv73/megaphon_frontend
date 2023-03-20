<template>
  <div class="admin-page container flex column gap20 height-all">
    <h2>{{$t('adminZone')}}</h2>
    <nav class="flex align-center gap10">
      <router-link :to="{name: 'Admin_AccountPage' }">{{$t('account.accounts')}}</router-link>
      <router-link :to="{name: 'Admin_BugPage' }">{{$t('bug.bugs')}}</router-link>
    </nav>
    <router-view style="height: unset !important;overflow: auto;" class="flex-1"/>
  </div>
</template>

<script>
export default {
  name: 'AdminPage'
}
</script>

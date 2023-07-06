<template>
  <aside class="main-sidebar height-all flex column gap10">
    <div v-if="loggedUser" class="sidebar-header flex align-center space-between">
      <span>{{$t('hello')}}, {{`${loggedUser.firstName} ${loggedUser.lastName}`}}</span>
      <img class="avatar" :src="require('@/apps/megaphonApp/assets/images/avatar_black.svg')" alt="">
    </div>
    <ul class="organization-list flex-1">
      <li class="organization-preview" v-for="org in organizations" :key="org._id">
        <div class="nav-list-item flex align-center gap10" @click="selectOrg(org._id)">
          <Avatar :size="40">{{org.name.slice(0,2)}}</Avatar>
          <p>{{org.name}}</p>
        </div>
        <div class="flex column" v-if="selectedOrgId === org._id">
          <router-link class="nav-list-item inner-list-item" :to="{ name: 'ReleasePage', params: { organizationId: org._id } }">{{$t('release.releases')}}</router-link>
          <router-link class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: org._id } }">{{$t('contact.contacts')}}</router-link>
          <router-link class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: org._id } }">{{$t('account.accounts')}}</router-link>
          <FoldersNav :folders="org.folders || []" :parentItem="org"/>
        </div>
      </li>
      <li class="organization-preview" v-if="isAdmin">
        <div class="nav-list-item" @click="showAdminNav = !showAdminNav">
          <Avatar :size="40">{{'מגפון'.slice(0,2)}}</Avatar>
        </div>
        <div class="flex column" v-if="showAdminNav">
          <router-link class="nav-list-item inner-list-item" :to="{ name: 'ContactPage', params: { organizationId: '-1' } }">{{$t('contact.contacts')}}</router-link>
          <router-link class="nav-list-item inner-list-item" :to="{ name: 'AccountPage', params: { organizationId: '-1' } }">{{$t('account.accounts')}}</router-link>
          <router-link class="nav-list-item inner-list-item" :to="{ name: 'OrganizationPage' }">{{$t('organization.organizations')}}</router-link>
        </div>
      </li>
    </ul>
    <div>
      Powered by Megaphon
    </div>
  </aside>
</template>



<script>
import Avatar from '../../../../../common/modules/common/cmps/Avatar.vue';
import FoldersNav from './FoldersNav.vue';
export default {
  components: { Avatar, FoldersNav },
  name: 'SideBar',
  data() {
    return {
      showAdminNav: false,
      showFolders: false
    }
  },
  props: {
    organizations: [Array],
    loggedUser: [Object]
    // selectedOrgId: {
    //   type: String,
    //   required: false,
    //   default: ''
    // }
  },
  computed: {
    selectedOrgId() {
      return this.$route.params.organizationId;
    },
    isAdmin() {
      return this.$store.getters['auth/isAdmin'];
    }
  },
  methods: {
    selectOrg(orgId) {
      this.$router.push({ name: 'ReleasePage', params: { organizationId: orgId } });
      this.showFolders = false;
      console.log(this.organizations);
      // this.$emit('selectOrganization', orgId);
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/styles/global/index';
.megaphon-app {
  .main-sidebar {

    color: #2090D4;
    
    padding: 10px;
    height: auto;

    width: 250px;
    .sidebar-header {
      width: 100%;
      .avatar {
        width: 30px;
        height: 30px;
      }
    }

    .folder-avatar {
      overflow: hidden;
    }

    .nav-list-item {
      height: 50px;
      border-bottom: 1px solid lighten(#2090D4, 40);
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .inner-list-item {
      padding-inline-start: 50px;
      border-bottom: 1px solid rgba(91, 91, 91, 0.2);
    }

  }
}
</style>
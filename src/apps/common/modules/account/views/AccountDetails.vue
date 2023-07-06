<template>
  <div class="account-details flex column gap15" v-if="account">
    <h2>{{account.firstname}} {{account.lastname}}</h2>
    <MiniAccountPreview :account="account"/>
    <p>{{account.email}}</p>
    <p>{{$t('systemRoles')}}: {{account.roles.map(c => $t(c)).join(', ')}}</p>
    <div class="flex column gap5">
      <p>{{$t('organization.organizations')}}:</p>
      <ul class="flex column gap5">
        <li v-for="org in account.organizations" :key="org._id">
          <router-link :to="{ name: 'OrganizationDetails', params: { id: org._id } }">
            <button class="btn">{{org.name}}</button>
          </router-link>
        </li>
      </ul>
    </div>
    <router-link v-if="isLoggedUser" :to="{name: 'AccountEdit', params: {id: account._id}}"><button class="btn">{{$t('edit')}}</button></router-link>
  </div>
</template>

<script>
import MiniAccountPreview from '../cmps/MiniAccountPreview.vue';
export default {
  components: { MiniAccountPreview },
  name: 'AccountDetails',
  methods: {
    getAccount() {
      this.$store.dispatch({ type: 'account/loadAccount', id: this.$route.params.id });
    }
  },
  computed: {
    account() {
      return this.$store.getters['account/selectedItem'];
    },
    isLoggedUser() {
      return this.$route.params.id === this.$store.getters['auth/loggedUser']?._id;
    }
  },
  created() {
    this.getAccount();
  },
  watch: {
    '$route.params.id'() {
      this.getAccount();
    }
  }
}
</script>
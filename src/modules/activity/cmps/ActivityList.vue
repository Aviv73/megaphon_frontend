<template>
  <section class="activity-list-container flex column gap10">
    <ul class="activity-list flex column gap5">
        <li v-for="activity in activities" :key="activity._id" class="width-all flex align-start space-between">
          <p>{{activity.by.username}}:</p>
          <p> {{activity.desc}}</p>
        </li>

      <li v-if="isLoading">
        <Loader/>
      </li>
      <li v-else-if="isLoadable">
        <button class="btn" @click="loadChunk">{{$t('loadMore')}}</button>
      </li>
      <li v-else>
        {{$t('activities.noMoreActivities')}}
      </li>
    </ul>
  </section>
</template>

<script>
import Loader from '@/modules/common/cmps/Loader.vue';
import FormInput from '@/modules/common/cmps/FormInput.vue';

export default {
  name: 'activityList',
  props: {
    attachedId: {
      type: String
    }
  },
  data() {
    return {
      isLoading: false,
      activitiesData: null,
      page: 0,
    }
  },
  computed: {
    activities() {
      return this.activitiesData?.items || [];
    },
    loggedUser() {
      return this.$store.getters['auth/loggedUser'];
    }
  },
  created() {
    this.loadChunk();
  },
  methods: {
    loadActivities(pagination) {
      return this.$store.dispatch({ type: 'activity/loadActivities', filterBy: {  filter: { params: { attachedId: this.attachedId } }, pagination } });
    },
    async loadChunk() {
      this.isLoading = true;
      const pageData = { page: this.page, limit: 10 };
      const data = await this.loadActivities(pageData);
      if (!this.activitiesData) this.activitiesData = data;
      else this.activitiesData.items.push(...data.items);
      this.page++;
      this.isLoading = false;
    },

  },
  components: { Loader, FormInput }
}
</script>

<style>

</style>
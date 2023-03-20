<template>
  <li class="bug-preview item-preview flex column gap20 align-start">
    <div class="flex-1 flex column gap20">
      <h3>{{item.title}}</h3>
      <p>{{item.desc}}</p>
    </div>
    <div class="toggle-btns">
      <button :class="{selected: item.status === 'resolved'}" @click="updateBugStatus('resolved')">{{$t('bug.resolve')}}</button>
      <button :class="{selected: item.status === 'pending'}" @click="updateBugStatus('pending')">{{$t('bug.pending')}}</button>
      <button :class="{selected: item.status === 'ignored'}" @click="updateBugStatus('ignored')">{{$t('bug.ignore')}}</button>
    </div>
    <!-- <router-link :to="{ name: 'BugDetails', params: { id: item._id } }">
    </router-link> -->
  </li>
</template>

<script>
export default {
  name: 'BugPreview',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    updateBugStatus(status) {
      this.$store.dispatch({ type: 'bug/saveBug', bug: { ...this.item, status } });
    }
  }
}
</script>
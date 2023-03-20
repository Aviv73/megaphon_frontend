<template>
  <div class="bug-edit flex column gap30">
    <h2>{{$t('bug.reportABug')}}!</h2>
    <p>{{$t('bug.reportABugMsg')}}</p>
    <form v-if="bugToEdit" @submit.prevent="saveBug" class="flex column align-start gap15 simple-form">
      <FormInput type="text" labelholder="title" v-model="bugToEdit.title"/>
      <FormInput type="textarea" labelholder="description" v-model="bugToEdit.desc"/>
      <button class="btn primary" :disabled="!isBugValid">{{$t('submit')}}</button>
    </form>
  </div>
</template>

<script>
import FormInput from '../../common/cmps/FormInput.vue'
export default {
  name: 'BugEdit',
  data() {
    return {
      bugToEdit: null
    }
  },
  computed: {
    isBugValid() {
      const bug = this.bugToEdit;
      return bug && bug.title && bug.desc;
    }
  },
  methods: {
    async getBug() {
      this.bugToEdit = await this.$store.dispatch({ type: 'bug/loadBug', id: this.$route.params.id });
    },
    async saveBug() {
      if (!this.isBugValid) return;
      await this.$store.dispatch({ type: 'bug/saveBug', bug: this.bugToEdit });
      this.$router.push({ name: 'HomePage' })
    }
  },
  created() {
    this.getBug();
  },
  watch: {
    '$route.params.id'() {
      this.getBug();
    }
  },
  components: {
    FormInput
  }
}
</script>
<template>
  <div class="contact-report-page container flex column gap50 width-all align-stretch">
    <h1>
      {{$t('distribute.contactReport')}}
    </h1>
    <div class="flex column gap20" v-if="report">
      <h3>{{$t('contact.contact')}}: {{contactPreviewName}}</h3>
      <p>{{$t('email')}}: {{report.email}}</p>
      <div class="flex column gap20">
        <h3>{{$t('distribute.distributions')}}:</h3>
        <div v-for="orgData in report.distributionsDataByOrgs" :key="orgData.organizationId" class="flex column gap10">
          <h4>{{orgData.name}}</h4>
          <div class="table-like-list flex-1">
            <div class="table-item-preview gap10 table-header flex space-between">
              <p class="flex-1 wide-screen-item">{{$t('date')}}</p>
              <p class="flex-2">{{$t('release.release')}}</p>
              <p class="flex-1 wide-screen-item">{{$t('distribute.origin')}}</p>
              <p class="flex-1">{{$t('distribute.newsletter')}}</p>
              <p class="flex-1">{{$t('distribute.wached')}}</p>
              <p class="flex-1 wide-screen-item">{{$t('distribute.wachedCount')}}</p>
              <p class="flex-1 wide-screen-item">{{$t('distribute.unsubscribed')}}</p>
            </div>
            <div
              v-for="release in [...orgData.items].reverse()" :key="release.releaseId"
              class="table-item-preview gap10 flex align-center space-between"
            >
              <p class="flex-1 wide-screen-item">{{release.activity?.distributedAt? pretyDate(release.activity?.distributedAt) : '-'}}</p>
              <p class="flex-2">{{release.subject}}</p>
              <p class="flex-1 wide-screen-item">{{$t(`distribute.origins.${release.origin}`)}}</p>
              <p class="flex-1">{{vOrX(release.activity?.views?.filter(c => c.platform === 'email')?.length)}}</p>
              <p class="flex-1">{{vOrX(release.activity?.views?.filter(c => c.platform === 'landingPage')?.length)}}</p>
              <p class="flex-1 wide-screen-item">{{release.activity?.views?.filter(c => c.platform === 'landingPage')?.length || '-'}}</p>
              <p class="flex-1 wide-screen-item">{{vOrX(release.activity?.unsubscribedAt)}}</p>
            </div>
          </div>
        </div>
      </div>
      <!-- <pre class="ltr">
        {{report}}
      </pre> -->
    </div>
  </div>
</template>

<script>
import { Utils } from '../../../../common/modules/common/services/util.service';
import { contactService } from '../../contact/contact.service';
export default {
  name: 'ContactReportPage',
  computed: {
    routeId() {
      return this.$route.params.id;
    },
    routeEmail() {
      return this.$route.query.email;
    },
    report() {
      return this.$store.getters['release/selectedContactReport'];
    },

    contactPreviewName() {
      return contactService.getContactPreviewName(this.report);
    }
  },
  methods: {
    loadContactReport() {
      const email = this.routeEmail;
      const id = this.routeId === 'unknown' ? '' : this.routeId;
      this.$store.dispatch({ type: 'release/loadContactReport', id, email });
    },
    
    pretyDate: Utils.pretyDate,
    vOrX: Utils.vOrX
  },
  created() {
    this.loadContactReport();
  }
}
</script>

<style>
.contact-report-page {

}
</style>
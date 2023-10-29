import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'distribution';

export const distributionService = {
  distribute,
  testDistribute,

  getMailingList,
  queryMailingLists,
  addMailingList,

  getByReleaseId,
  reportReleaseOpened
}

function distribute(releaseId, distributionData) {
  return httpService.post(`${ENDPOINT}/distribute-release/${releaseId}`, distributionData);
}
function testDistribute(releaseId, distributionData) {
  return httpService.post(`${ENDPOINT}/test/${releaseId}`, distributionData);
}


function getMailingList(id, organizationId) {
  return httpService.get(`${ENDPOINT}/mailing-list/${organizationId}/${id}`);
}
function queryMailingLists(organizationId) {
  return httpService.get(`${ENDPOINT}/mailing-list/${organizationId}`);
}
function addMailingList(mailingListItem) {
  return httpService.post(`${ENDPOINT}/mailing-list/`, mailingListItem);
}


function getByReleaseId(releaseId) {
  return httpService.get(`${ENDPOINT}/distribution-data-by-release/${releaseId}`);
}

function reportReleaseOpened(releaseId, queryParams) {
  // const urlParams = new URLSearchParams(window.location.search);
  // const origin = urlParams.get('origin');
  // const token = urlParams.get('token');
  // const params = new Proxy(new URLSearchParams(window.location.search), {
  //   get: (searchParams, prop) => searchParams.get(prop),
  // });
  // let origin = params.origin; 
  // let token = params.token; 
  const origin = queryParams.origin;
  const token = queryParams.token;
  console.log({ origin, token, releaseId, isLandingPage: true });
  if (!origin) return;
  return httpService.get(`${ENDPOINT}/release-opened/`, { origin, token, releaseId, isLandingPage: true });
}
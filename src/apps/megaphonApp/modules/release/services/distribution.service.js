import { httpService } from '@/apps/common/modules/common/services/http.service';
import { getQueryParam, Utils } from '../../../../common/modules/common/services/util.service';

const ENDPOINT = 'distribution';

export const distributionService = {
  distribute,
  testDistribute,

  getByReleaseId,
  removeDistData,
  reportReleaseOpened,
  getContactReport,

  updateSubscriptionValue
}

async function distribute(organizationId, releaseId, distributionData, onChunkEndCb = (sentToCount) => {} ) {
  const contacts = distributionData.contacts;
  const pages = Utils.splitDataToPages(contacts, 100);
  const results = [];
  console.log('DISTRIBUTING! tatal of', pages.length, 'pages');
  let sentTo = 0;
  for (let i = 0; i < pages.length; i++) {
    console.log('WORKING ON PAG', i+1);
    const currContacts = pages[i];
    const currRes = await httpService.post(`${ENDPOINT}/${organizationId}/distribute-release/${releaseId}`, {...distributionData, contacts: currContacts});
    results.push(currRes);
    sentTo += currContacts.length;
    onChunkEndCb?.(sentTo);
    console.log('DONE WORKING ON PAG', i+1);
  }
  console.log('DONE DISTRIBUTING!');
  return {
    sentToContacts: results.reduce((acc, c) => [...acc, ...c.sentToContacts], []),
    faildSendToContacts: results.reduce((acc, c) => [...acc, ...c.faildSendToContacts], []),
    allreadyDistributedTo: results.reduce((acc, c) => [...acc, ...c.allreadyDistributedTo], []),
    unsubscribedContacts: results.reduce((acc, c) => [...acc, ...c.unsubscribedContacts], []),
    missingDataContacts: results.reduce((acc, c) => [...acc, ...c.missingDataContacts], []),
  }
  // return httpService.post(`${ENDPOINT}/distribute-release/${releaseId}`, distributionData);
}
function testDistribute(organizationId, releaseId, distributionData) {
  return httpService.post(`${ENDPOINT}/${organizationId}/test/${releaseId}`, distributionData);
}



function getByReleaseId(organizationId, releaseId) {
  return httpService.get(`${ENDPOINT}/${organizationId}/distribution-data-by-release/${releaseId}`);
}
function removeDistData(organizationId, releaseId) {
  return httpService.delete(`${ENDPOINT}/${organizationId}/${releaseId}`);
}

function getContactReport(id, email) {
  return httpService.get(`${ENDPOINT}/distribution-data-by-contact/`, { id, email });
}


function updateSubscriptionValue(contactId, organizationId, subscriptionValue) {
  return httpService.post(`${ENDPOINT}/update-subscription-value/`, { contactId, organizationId, subscriptionValue });
}


async function reportReleaseOpened(releaseId, queryParams) {
  // const urlParams = new URLSearchParams(window.location.search);
  // const origin = urlParams.get('origin');
  // const token = urlParams.get('token');
  // const params = new Proxy(new URLSearchParams(window.location.search), {
  //   get: (searchParams, prop) => searchParams.get(prop),
  // });
  // let origin = params.origin; 
  // let token = params.token; 
  if (sessionStorage.reportedReleaseOpen) return;
  const origin = queryParams.origin;
  const token = queryParams.token;
  const releaseIdInQuery = queryParams.releaseId;
  if (!token) return;
  await httpService.get(`${ENDPOINT}/release-opened/`, { origin, token, releaseId: releaseIdInQuery || releaseId, isLandingPage: true, platform: 'landingPage' });
  sessionStorage.reportedReleaseOpen = true;
}


async function reportReleaseOpenedForOutsourceSite(releaseId = '') {
  if (sessionStorage.reportedReleaseOpen) return;
  function getQueryParam(param) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
  }
  const origin = getQueryParam('origin');
  const token = getQueryParam('token');
  const releaseIdInQuery = getQueryParam('releaseId');
  if (!token) return;
  await fetch(
    `${BASE_API_URL}/distribution/release-opened/`
      + `?token=${token}`
      + `&origin=${origin}`
      + `&releaseId=${releaseIdInQuery || releaseId}`
      + `&isLandingPage=${true}`
      + `&platform=${'landingPage'}`
  );
  sessionStorage.reportedReleaseOpen = true;
}
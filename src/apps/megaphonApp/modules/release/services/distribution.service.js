import { httpService } from '@/apps/common/modules/common/services/http.service';
import { getQueryParam, splitDataToPages } from '../../../../common/modules/common/services/util.service';

const ENDPOINT = 'distribution';

export const distributionService = {
  distribute,
  testDistribute,

  getMailingList,
  queryMailingLists,
  addMailingList,
  updateMailingList,
  removeMailingList,

  getByReleaseId,
  reportReleaseOpened,
  getContactReport,

  updateSubscriptionValue
}

async function distribute(organizationId, releaseId, distributionData, onChunkEndCb = (sentToCount) => {} ) {
  const contacts = distributionData.contacts;
  const pages = splitDataToPages(contacts, 200);
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
    sentToUsers: results.reduce((acc, c) => [...acc, ...c.sentToUsers], []),
    faildSendToUsers: results.reduce((acc, c) => [...acc, ...c.faildSendToUsers], []),
    allreadyDistributedTo: results.reduce((acc, c) => [...acc, ...c.allreadyDistributedTo], []),
    unsubscribedContacts: results.reduce((acc, c) => [...acc, ...c.unsubscribedContacts], []),
  }
  // return httpService.post(`${ENDPOINT}/distribute-release/${releaseId}`, distributionData);
}
function testDistribute(organizationId, releaseId, distributionData) {
  return httpService.post(`${ENDPOINT}/${organizationId}/test/${releaseId}`, distributionData);
}


function getMailingList(organizationId, id) {
  return httpService.get(`${ENDPOINT}/${organizationId}/mailing-list/${id}`);
}
function queryMailingLists(organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}/mailing-list`);
}
function addMailingList(organizationId, mailingListItem) {
  return httpService.post(`${ENDPOINT}/${organizationId}/mailing-list/`, mailingListItem);
}
function updateMailingList(organizationId, mailingListItem) {
  return httpService.put(`${ENDPOINT}/${organizationId}/mailing-list/${mailingListItem._id}`, mailingListItem);
}
function removeMailingList(organizationId, id) {
  return httpService.delete(`${ENDPOINT}/${organizationId}/mailing-list/${id}`);
}


function getByReleaseId(organizationId, releaseId) {
  return httpService.get(`${ENDPOINT}/${organizationId}/distribution-data-by-release/${releaseId}`);
}

function getContactReport(id, email) {
  return httpService.get(`${ENDPOINT}/distribution-data-by-contact/`, { id, email });
}


function updateSubscriptionValue(contactId, organizationId, subscriptionValue) {
  return httpService.post(`${ENDPOINT}/update-subscription-value/`, { contactId, organizationId, subscriptionValue });
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
  if (!token) return;
  return httpService.get(`${ENDPOINT}/release-opened/`, { origin, token, releaseId, isLandingPage: true });
}


function reportReleaseOpenedForOutsourceSite(releaseId = '') {
  function getQueryParam(param) {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get(param);
  }
  const origin = getQueryParam('origin');
  const token = getQueryParam('token');
  const releaseIdInQuery = getQueryParam('releaseId');
  if (!token) return;
  return fetch(
    `${BASE_API_URL}/distribution/release-opened/`
      + `?token=${token}`
      + `&origin=${origin}`
      + `&releaseId=${releaseIdInQuery || releaseId}`
      + `&isLandingPage=${true}`
  );
}
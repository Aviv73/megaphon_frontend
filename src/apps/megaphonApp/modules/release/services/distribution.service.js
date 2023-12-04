import { httpService } from '@/apps/common/modules/common/services/http.service';
import { splitDataToPages } from '../../../../common/modules/common/services/util.service';

const ENDPOINT = 'distribution';

export const distributionService = {
  distribute,
  testDistribute,

  getMailingList,
  queryMailingLists,
  addMailingList,
  updateMailingList,

  getByReleaseId,
  reportReleaseOpened
}

async function distribute(releaseId, distributionData) {
  const contacts = distributionData.contacts;
  const pages = splitDataToPages(contacts, 500);
  const results = [];
  console.log('DISTRIBUTING! tatal of', pages.length, 'pages');
  for (let i = 0; i < pages.length; i++) {
    console.log('WORKING ON PAG', i+1);
    const currContacts = pages[i];
    const currRes = await httpService.post(`${ENDPOINT}/distribute-release/${releaseId}`, {...distributionData, contacts: currContacts});
    results.push(currRes);
    console.log('DONE WORKING ON PAG', i+1);
  }
  console.log('DONE DISTRIBUTING!');
  return {
    sentToUsers: results.reduce((acc, c) => [...acc, ...c.sentToUsers], []),
    faildSendToUsers: results.reduce((acc, c) => [...acc, ...c.faildSendToUsers], [])
  }
  // return httpService.post(`${ENDPOINT}/distribute-release/${releaseId}`, distributionData);
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
function updateMailingList(mailingListItem) {
  return httpService.put(`${ENDPOINT}/mailing-list/${mailingListItem._id}`, mailingListItem);
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
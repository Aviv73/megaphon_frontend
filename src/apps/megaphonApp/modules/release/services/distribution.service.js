import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'distribution';

export const distributionService = {
  distribute,
  testDistribute,

  getMailingList,
  queryMailingLists,
  addMailingList
}

function distribute(releaseId, distributionData) {
  return httpService.post(`${ENDPOINT}/distribution/${releaseId}`, distributionData);
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
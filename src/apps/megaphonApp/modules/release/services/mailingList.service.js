import { httpService } from '@/apps/common/modules/common/services/http.service';
import { getQueryParam, splitDataToPages } from '../../../../common/modules/common/services/util.service';

const ENDPOINT = 'mailing-list';

export const mailingListService = {
  getMailingList,
  queryMailingLists,
  addMailingList,
  updateMailingList,
  removeMailingList,
}

function getMailingList(organizationId, id) {
  return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
}
function queryMailingLists(organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}`);
}
function addMailingList(organizationId, mailingListItem) {
  return httpService.post(`${ENDPOINT}/${organizationId}/`, mailingListItem);
}
function updateMailingList(organizationId, mailingListItem) {
  return httpService.put(`${ENDPOINT}/${organizationId}/${mailingListItem._id}`, mailingListItem);
}
function removeMailingList(organizationId, id) {
  return httpService.delete(`${ENDPOINT}/${organizationId}/${id}`);
}

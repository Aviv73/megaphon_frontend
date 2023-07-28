import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'organization';

export const organizationService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyOrganization,

  loadDataFields
  // inviteAccount,
  // updateAccountStatus,
  // updateAccountRole,
  // removeAccount
}

function query(filterBy) {
  return httpService.get(ENDPOINT, filterBy);
}
function get(id) {
  if (!id) return getEmptyOrganization();
  return httpService.get(`${ENDPOINT}/${id}`);
}
function add(item) {
  return httpService.post(ENDPOINT, item);
}
function update(item) {
  return httpService.put(ENDPOINT, item);
}
function remove(id) {
  return httpService.delete(`${ENDPOINT}/${id}`);
}
function save(item) {
  return item._id? update(item) : add(item);
}

function loadDataFields(dataFieldsLocalFilePath, organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}/dataFields`, { dataFieldsLocalFilePath });
}



// function inviteAccount(organizationId, accountId) {
//   return httpService.post(`${ENDPOINT}/${organizationId}/invite`, { accountId });
// }
// function updateAccountStatus(organizationId, accountId, status) {
//   return httpService.post(`${ENDPOINT}/${organizationId}/update-status`, { accountId, status });
// }
// function updateAccountRole(organizationId, accountId, roles) {
//   return httpService.post(`${ENDPOINT}/${organizationId}/update-roles`, { accountId, roles });
// }
// function removeAccount(organizationId, accountId) {
//   return httpService.post(`${ENDPOINT}/${organizationId}/remove-user`, { accountId });
// }




function getEmptyOrganization() {
  return {
    name: '',
    desc: ''
  }
}
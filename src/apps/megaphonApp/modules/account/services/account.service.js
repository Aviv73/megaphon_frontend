// import { httpService } from '@/apps/common/modules/common/services/http.service';

// const ENDPOINT = 'account';

export const accountService = {
  // query,
  // get,
  // add,
  // update,
  // save,
  getEmptyAccount
}

// function query(filterBy, organizationId) {
//   filterBy.organizationId = organizationId
//   return httpService.get(ENDPOINT, filterBy);
// }
// function get(id) {
//   if (!id) return getEmptyAccount();
//   return httpService.get(`${ENDPOINT}/${id}`);
// }
// function add(account) {
//   return httpService.post(ENDPOINT, account);
// }
// function update(account) {
//   return httpService.put(ENDPOINT, account);
// }
// function save(account) {
//   return account._id? update(account) : add(account);
// }


function getEmptyAccount() {
  return {
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    roles: ['user'],
    organizations: [],
    password: '',
    bgImg: ''
  }
}
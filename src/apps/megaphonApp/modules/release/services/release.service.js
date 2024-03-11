import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'release';

export const releaseService = {
  query,
  // get,
  // add,
  // update,
  // remove,
  // save,
  getEmptyRelease
}

function query(filterBy, organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}`, filterBy);
}
// function get(id, organizationId) {
//   if (!id) return getEmptyRelease();
//   return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
// }


// function add(item, organizationId) {
//   return httpService.post(`${ENDPOINT}/${organizationId}`, item);
// }
// function update(item, organizationId) {
//   return httpService.put(`${ENDPOINT}/${organizationId}`, item);
// }
// function remove(id, organizationId) {
//   return httpService.delete(`${ENDPOINT}/${organizationId}/${id}`);
// }
// function save(item, organizationId) {
//   return item._id? update(item, organizationId) : add(item, organizationId);
// }


function getEmptyRelease() {
  return {
    organizationId: '',
    releaseType: '',
    releaseData: {},
    design: {
      landingPage: '',
      email: '',
      locale: "he"
    },
    // distribution: {},
    // distributionId: '',
    // allText: ''
  }
}
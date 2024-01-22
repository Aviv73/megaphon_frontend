import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'release';

export const releaseService = {
  query,
  get,
  add,
  update,
  remove,
  save
}

function query(filterBy, organizationId) {
  // return Promise.resolve({
  //   items: [...mockBookReleases, ...mockBookReleases, ...mockBookReleases],
  //   total: mockBookReleases.length
  // });
  return httpService.get(`${ENDPOINT}/${organizationId}`, filterBy);
}
function get(id, organizationId) {
  // return Promise.resolve(mockReleases.find(c => c._id === id) || mockReleases[0]);
  if (!id) return getEmptyRelease();
  return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
}


function add(item, organizationId) {
  return httpService.post(`${ENDPOINT}/${organizationId}`, item);
}
function update(item, organizationId) {
  return httpService.put(`${ENDPOINT}/${organizationId}`, item);
}
function remove(id, organizationId) {
  return httpService.delete(`${ENDPOINT}/${organizationId}/${id}`);
}
function save(item, organizationId) {
  return item._id? update(item, organizationId) : add(item, organizationId);
}


function getEmptyRelease() {
  return {
    releaseType: '',
    releaseData: {},
    design: {
      landingPage: '',
      email: '',
    },
    organizationId: '',
    // distribution: {},
    // distributionId: '',
    // allText: ''
  }
}
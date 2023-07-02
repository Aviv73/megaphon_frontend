import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'release';

export const releaseService = {
  query,
  get
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
  return httpService.get(`${ENDPOINT}/${organizationId}/${id}`);
}


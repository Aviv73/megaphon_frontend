import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'organization';

export const organizationService = {
  // query,
  get
}

// function query(filterBy) {
//   // return Promise.resolve({
//   //   items: [...mockBookReleases, ...mockBookReleases, ...mockBookReleases],
//   //   total: mockBookReleases.length
//   // });
//   return httpService.get(`${ENDPOINT}/${organizationId}`, filterBy);
// }
function get(id) {
  // return Promise.resolve(mockReleases.find(c => c._id === id) || mockReleases[0]);
  return httpService.get(`${ENDPOINT}/${id}`);
}


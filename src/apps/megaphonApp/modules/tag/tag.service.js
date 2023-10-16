import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'tag';

export const tagService = {
  query,
  get
}

function query(filterBy, organizationId = '') {
  return httpService.get(`${ENDPOINT}`, {...filterBy, organizationId});
}
function get(id) {
  return httpService.get(`${ENDPOINT}/${id}`);
}


import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'company';

export const companyService = {
  query,
  get
}

function query(filterBy) {
  return httpService.get(`${ENDPOINT}`, filterBy);
}
function get(id) {
  return httpService.get(`${ENDPOINT}/${id}`);
}


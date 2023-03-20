import { httpService } from '@/modules/common/services/http.service';

const ENDPOINT = 'dashboard';

export const dashboardService = {
  getDashboardData,
  getOrganizationStats
}

function getDashboardData() {
  return httpService.get(`${ENDPOINT}/`);
}


function loadDashboardData(filter) {
  return httpService.get(`${ENDPOINT}/stats`, filter);
}
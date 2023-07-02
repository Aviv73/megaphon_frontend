import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'settings';

export const settingsService = {
  getSettings,
  updateSettings,
  getConfig
}

function getSettings() {
  return httpService.get(`${ENDPOINT}/`);
}
function updateSettings(settingsToUpdate) {
  return httpService.put(`${ENDPOINT}/`, settingsToUpdate);
}
function getConfig() {
  return httpService.get(`${ENDPOINT}/config`);
}
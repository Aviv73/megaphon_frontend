import { httpService } from '@/apps/common/modules/common/services/http.service';


const ENDPOINT = 'organization';

export const organizationService = {
  loadReleaseDataFields
}


function loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType) {
  return httpService.get(`${ENDPOINT}/${organizationId}/releaseDataFields`, { dataFieldsLocalFilePath, releaseType });
}
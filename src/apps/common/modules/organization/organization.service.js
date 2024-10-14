import { httpService } from '@/apps/common/modules/common/services/http.service';


const ENDPOINT = 'organization';

export const organizationService = {
  loadReleaseDataFields,
  getOrgRoutesByRoles
}


function loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType) {
  return httpService.get(`${ENDPOINT}/${organizationId}/releaseDataFields`, { dataFieldsLocalFilePath, releaseType });
}


function getOrgRoutesByRoles(org, roles = []) {
  return org?.routes?.filter(c => c.showInRoles?.find(role => roles.includes(role))) || [];
}
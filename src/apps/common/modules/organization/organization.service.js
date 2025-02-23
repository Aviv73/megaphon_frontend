import { httpService } from '@/apps/common/modules/common/services/http.service';
import { consts } from '@/apps/common/modules/common/services/const.service.js';


const ENDPOINT = 'organization';

export const organizationService = {
  // loadReleaseDataFields,
  // getOrgRoutesByRoles,

  

  loadReleaseDataFields,
  getOnlyOrgsToShow,

  isUserRoleInOrg,
  isAccountAuthorizedToRoute,
  isUserWatchOnly,
  isUserAdmin,
  isOrgPending,


  isUserInOrg,
  getOrgItemInAccount,

  getOrgRoutesByRoles,
}


function loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType) {
  return httpService.get(`${ENDPOINT}/${organizationId}/releaseDataFields`, { dataFieldsLocalFilePath, releaseType });
}

function isUserRoleInOrg(orgId, role, user, isOnlyRole) {
  if (!orgId || !role || !user) return false;
  const orgItem = getOrgItemInAccount(user, orgId);
  const isRole = orgItem?.roles?.includes(role);
  if (!isOnlyRole) return isRole;
  return isRole && orgItem?.roles?.length === 1;
}
function isUserWatchOnly(orgId, user) {
  // return false;
  // return isUserRoleInOrg(orgId, 'client', user, true);
  return isUserRoleInOrg(orgId, consts.organizationRoles.client, user, true);
}
function isUserAdmin(orgId, user) {
  return isUserRoleInOrg(orgId, consts.organizationRoles.admin, user, false);
}
function isOrgPending(orgId, user) {
  return getOrgItemInAccount(user, orgId)?.status === consts.organizationStatuses.pending;
}
function isUserInOrg(orgId, user) {
  if (!orgId || !user) return false;
  return !!getOrgItemInAccount(user, orgId);
}
function getOrgItemInAccount(user, orgId) {
  if (!user) return null;
  return user.organizations?.find(org => org._id === orgId);
}
function isAccountAuthorizedToRoute(account, org, routeItemIdOrName) {
  if (!account|| !org || !routeItemIdOrName) return false;
  const routeItem = org.routes.find(c => [c.id, c.name].includes(routeItemIdOrName));
  if (!routeItem) return false;
  const accountOrgData = getOrgItemInAccount(account, org._id);
  if (!accountOrgData) return false;
  return routeItem.showInRoles.find(role => accountOrgData.roles.includes(role));
}

function getOnlyOrgsToShow(orgs, appConfig) { // vue method
  if (appConfig.singleOrgMode) return [orgs.find(c => [c._id, c.domain].includes(appConfig.appOrganizationId))].filter(Boolean);
  if (this.$store.getters['auth/isWatchOnly']) {
    return orgs.filter(c => !c.isStandAlone);
  }
  return orgs;
}



function getOrgRoutesByRoles(org, roles = []) {
  return org?.routes?.filter(c => c.showInRoles?.find(role => roles.includes(role))) || [];
}

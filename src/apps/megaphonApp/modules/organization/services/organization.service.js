import { httpService } from '@/apps/common/modules/common/services/http.service';
import { templateUtils } from '../../common/services/template.util.service';

import { getRandomId, setDeepVal } from '../../../../common/modules/common/services/util.service'

const ENDPOINT = 'organization';

export const organizationService = {
  // query,
  // get,
  // add,
  // update,
  // save,
  // remove,

  inviteAccount,
  updateAccountStatus,

  getEmptyOrganization,
  createEmptyReleaseTypeItem,
  createEmptyRouteItem,
  createEmptyInnerFilterItem,
  createEmptyTemplateItem,

  loadReleaseDataFields,
  loadAllDomainNames,
  isUserRoleInOrg,
  isAccountAuthorizedToRoute,

  getAccountOrgItem,

  isUserInOrg,
  getOrgItemInAccount,
  searchOrganizations
}

// function query(filterBy) {
//   return httpService.get(ENDPOINT, filterBy);
// }
// function get(id) {
//   if (!id) return getEmptyOrganization();
//   return httpService.get(`${ENDPOINT}/${id}`);
// }
// function add(item) {
//   return httpService.post(ENDPOINT, item);
// }
// function update(item) {
//   return httpService.put(ENDPOINT, item);
// }
// function remove(id) {
//   return httpService.delete(`${ENDPOINT}/${id}`);
// }
// function save(item) {
//   return item._id? update(item) : add(item);
// }

function inviteAccount(organizationId, accountId, status) {
  return httpService.post(`${ENDPOINT}/${organizationId}/invite`, { accountId, status });
}
function updateAccountStatus(organizationId, accountId, status) {
  return httpService.post(`${ENDPOINT}/${organizationId}/update-status`, { accountId, status });
}
// function updateAccountRole(organizationId, accountId, roles) {
//   return httpService.post(`${ENDPOINT}/${organizationId}/update-roles`, { accountId, roles });
// }
// function removeAccount(organizationId, accountId) {
//   return httpService.post(`${ENDPOINT}/${organizationId}/remove-user`, { accountId });
// }


function loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType) {
  return httpService.get(`${ENDPOINT}/${organizationId}/releaseDataFields`, { dataFieldsLocalFilePath, releaseType });
}
function loadAllDomainNames() {
  return httpService.get(`${ENDPOINT}/allDomainNames`, { });
}

function searchOrganizations(filterBy) {
  return httpService.get(`${ENDPOINT}/searchOrganizations`, filterBy);
}


function createEmptyReleaseTypeItem(name = '', isGroup = false) {
  return { name, id: getRandomId(), followReleaseType: '', /* fileUrl: '', */ dataFieldsStr: '', isGroup };
}
function createEmptyRouteItem(name = '', releaseTypes = []) {
  return { name, releaseFilter: {releaseTypes, wasDistributed: undefined}, id: getRandomId(), showInRoles: ['admin', 'producer'], htmlContentFilePath: '' };
}
function createEmptyInnerFilterItem() {
  return { field: '', title: '', options: [], id: getRandomId() };
}
function createEmptyTemplateItem() {
  return { name: '', type: '' /*'0'/'1'*/ , releaseTypes: [/*releaseTypesIds*/], url: '', previewUrl: '', id: getRandomId(), handlebarsLocalFilePath: '' };
}

function isUserRoleInOrg(orgId, role, user) {
  if (!orgId || !role || !user) return false;
  return user.organizations?.find(org => org.organizationId === orgId)?.roles?.includes(role);
}
function isUserInOrg(orgId, user) {
  if (!orgId || !user) return false;
  return !!getOrgItemInAccount(user, orgId);
}
function getOrgItemInAccount(user, orgId) {
  if (!user) return null;
  return user.organizations?.find(org => org.organizationId === orgId);
}
function isAccountAuthorizedToRoute(account, org, routeItemIdOrName) {
  if (!account|| !org || !routeItemIdOrName) return false;
  const routeItem = org.routes.find(c => [c.id, c.name].includes(routeItemIdOrName));
  if (!routeItem) return false;
  const accountOrgData = getOrgItemInAccount(account, org._id);
  if (!accountOrgData) return false;
  return routeItem.showInRoles.find(role => accountOrgData.roles.includes(role));
}

function getAccountOrgItem(orgId = '', inviterId = '') {
  return  {
    organizationId: orgId,
    invitedBy: inviterId,
    roles: [],
    invitedAt: Date.now(),
    status: 'approved'
  }
}


function getEmptyOrganization() {
  const org = {
    name: '',
    logoUrl: '',
    defaultGalleryCredit: '',
    distributionBcc: '',
    domain: '',
    fromEmails: [/* { email: '', title: '' } */],
    // filters: [/* { title: '', releaseTypes: [releaseTypesIds], wasDisterbuted: false } */],
    // releaseTypes: [/* { name: '', id: '', dataFieldsLocalFilePath: '', fileUrl: '', dataFieldsStr: 'NOT IN USE ___ JSON STRING FON NOW' } */],

    routes: [],
    // routes: JSON.parse(JSON.stringify(templateUtils.DEFAULY_TEMPLATES_DATA.routes)),
    // releaseTypes: JSON.parse(JSON.stringify(templateUtils.DEFAULY_TEMPLATES_DATA.releaseTypes)),
    releaseTypes: [
      {...createEmptyReleaseTypeItem('רליס', false), followReleaseType: templateUtils.DEFAULY_TEMPLATES_DATA.releaseTypes[0].id},
      {...createEmptyReleaseTypeItem('רליס קבוצתי', true), followReleaseType: templateUtils.DEFAULY_TEMPLATES_DATA.releaseTypes[1].id}
    ],

    templates: [/* { name: '', type: enum('0' => page, '1' => email), releaseTypes: [releaseTypesIds], handlebarsLocalFilePath: '', url: '', id: '', hadlebarsFileStr: 'NOT IN USE', appName: '' , previewUrl: 'NOT_IN_USE' } */],
    innerFilters: [/* { field: String, title: '', options: [ { value: Any, label: String } ], id: String } */],
    // subfilters: [/* { name: '', optionns: [{title:'', value: ''}], hideOnFilters: [releaseTyIds] } */],
    folders: [/* { name: '', children: [folders], content: [] } */],
    logos: [/* {url: '', id: '', title: ''} */],
    designPreferences: {
      // color: 'black',
      // bgColor: 'white',
      colorsPalate: [
        '#000000', // bodyColor
        '#ffffff', // bodyBg
        '#ffffff', // headerColor
        '#000000', // headerBg
        '#ffd700'  // headersColor
      ]
    },
    searchKeys: ''
  }
  org.releaseTypes.forEach(c => org.routes.push(createEmptyRouteItem(c.name, [c.id])));
  return org;
}
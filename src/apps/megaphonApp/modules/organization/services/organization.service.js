import { httpService } from '@/apps/common/modules/common/services/http.service';
import { templateUtils } from '../../../../common/modules/common/services/template.util.service';

import { Utils } from '../../../../common/modules/common/services/util.service';
import { consts } from '@/apps/common/modules/common/services/const.service.js';

import allThemes from '../../../themes/index';

const ENDPOINT = 'organization';

import { organizationService as commonOrgService } from '@/apps/common/modules/organization/organization.service';

export const organizationService = {
  // query,
  // get,
  // add,
  // update,
  // save,
  // remove,

  ...commonOrgService,

  inviteAccount,
  updateAccountStatus,

  getEmptyOrganization,
  createEmptyReleaseTypeItem,
  createEmptyRouteItem,
  createEmptyInnerFilterItem,
  createEmptyTemplateItem,

  loadAllDomainNames,
  searchOrganizations,
  
  // getOnlyOrgsToShow,
  getEmptyThemeItem,

  getAccountOrgItem,

  // loadReleaseDataFields,

  // isUserRoleInOrg,
  // isAccountAuthorizedToRoute,
  // isUserWatchOnly,
  // isUserAdmin,
  // isOrgPending,


  // isUserInOrg,
  // getOrgItemInAccount,

  // getOrgRoutesByRoles,
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


function loadAllDomainNames() {
  return httpService.get(`${ENDPOINT}/allDomainNames`, { });
}

function searchOrganizations(filterBy) {
  return httpService.get(`${ENDPOINT}/searchOrganizations`, filterBy);
}


function createEmptyReleaseTypeItem(name = '', isGroup = false) {
  return { name, id: Utils.getRandomId(), followReleaseType: '', /* fileUrl: '', */ dataFieldsLocalFilePath: '', isGroup };
}
function createEmptyRouteItem(name = '', releaseTypes = []) {
  return { name, releaseFilter: {releaseTypes, wasDistributed: undefined}, id: Utils.getRandomId(), showInRoles: ['admin', 'producer'], htmlContentFilePath: '' };
}
function createEmptyInnerFilterItem() {
  return { field: '', title: '', options: [], id: Utils.getRandomId() };
}
function createEmptyTemplateItem() {
  return { name: '', type: '' /*'0'/'1'*/ , releaseTypes: [/*releaseTypesIds*/], url: '', id: Utils.getRandomId(), handlebarsLocalFilePath: '', appName: '' };
}



function getAccountOrgItem(orgId = '', inviterId = '') {
  return  {
    _id: orgId,
    invitedBy: inviterId,
    approverId: inviterId,
    roles: [consts.organizationRoles.client],
    invitedAt: Date.now(),
    // status: 'approved'
    status: consts.organizationStatuses.approved
  }
}


function getEmptyThemeItem(idx = 0) {
  return {
    id: Utils.getRandomId(),
    name: allThemes[idx].name,
    colors: [...allThemes[idx].colors],
    fonts: [...allThemes[idx].fonts],
    css: ''
  }
}

// TODO:: MAKE SURE NOT MISSING ANY FIELD;
function getEmptyOrganization() {
  const org = {
    name: '',
    logo: {src:''},
    defaultGalleryCredit: '',
    distributionBcc: '',
    domain: '',
    
    requireAuth: false, 
    require2FactorAuth: false, 
    isStandAlone: false, 
    useVideoWaterMark: false,
    onlyKnownRegistrations: false,
    useDirectLink: false,
    dontUseGlobalDbData: false,
    restrictVideos: false,
    redirectUrl: '',

    fromEmails: [/* { email: '', title: '' } */],
    // filters: [/* { title: '', releaseTypes: [releaseTypesIds], wasDisterbuted: false } */],
    // releaseTypes: [/* { name: '', id: '', dataFieldsLocalFilePath: '', fileUrl: '', dataFieldsStr: 'NOT IN USE ___ JSON STRING FON NOW' } */],

    routes: [],
    // routes: JSON.parse(JSON.stringify(templateUtils.DEFAULY_TEMPLATES_DATA.routes)),
    // releaseTypes: JSON.parse(JSON.stringify(templateUtils.DEFAULY_TEMPLATES_DATA.releaseTypes)),
    releaseTypes: [
      {...createEmptyReleaseTypeItem('רליס', false), followReleaseType: templateUtils?.DEFAULY_TEMPLATES_DATA?.releaseTypes?.[0]?.id},
      {...createEmptyReleaseTypeItem('רליס קבוצתי', true), followReleaseType: templateUtils?.DEFAULY_TEMPLATES_DATA?.releaseTypes?.[1]?.id}
    ],

    templates: [/* { name: '', type: enum('0' => page, '1' => email), releaseTypes: [releaseTypesIds], handlebarsLocalFilePath: '', url: '', id: '', hadlebarsFileStr: 'NOT IN USE', appName: '' , previewUrl: 'NOT_IN_USE' } */],
    innerFilters: [/* { field: String, title: '', options: [ { value: Any, label: String } ], id: String } */],
    // subfilters: [/* { name: '', optionns: [{title:'', value: ''}], hideOnFilters: [releaseTyIds] } */],
    folders: [/* { name: '', children: [folders], content: [] } */],
    logos: [/* {src: '', id: '', title: ''} */],
    designPreferences: {
      clientApp:   [getEmptyThemeItem()],
      producerApp: [getEmptyThemeItem(0), getEmptyThemeItem(1)],
      newsletter:  [getEmptyThemeItem()],
      loginPage: [{
        id: Utils.getRandomId(),
        bgImg: {src:''},
        msg: ''
      }],
      contactMsg: ''
    },
    searchKeys: '',
    mediaLinks: [],
    filesManagement: {
      video: {
        requireAuth: true,
        downloadable: true
      },
      img: {
        requireAuth: true,
        downloadable: true
      },
      file: {
        requireAuth: true,
        downloadable: true
      },
    }
  }
  org.releaseTypes.forEach(c => org.routes.push(createEmptyRouteItem(c.name, [c.id])));
  return org;
}
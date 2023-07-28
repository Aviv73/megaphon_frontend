import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'organization';

export const organizationService = {
  query,
  get,
  add,
  update,
  save,
  getEmptyOrganization,

  loadDataFields
}

function query(filterBy) {
  return httpService.get(ENDPOINT, filterBy);
}
function get(id) {
  // if (!id) return getEmptyOrganization();
  return httpService.get(`${ENDPOINT}/${id}`);
}
function add(organization) {
  return httpService.post(ENDPOINT, organization);
}
function update(organization) {
  return httpService.put(ENDPOINT, organization);
}
function save(organization) {
  return organization._id? update(organization) : add(organization);
}

function loadDataFields(dataFieldsLocalFilePath, organizationId) {
  return httpService.get(`${ENDPOINT}/${organizationId}/dataFields`, { dataFieldsLocalFilePath });
}


function getEmptyOrganization() { // todo
  return {
    name: '',
    logoUrl: '',
    defaultGalleryCredit: '',
    distributionBcc: '',
    fromEmails: [/* { email: '', title: '' } */],
    filters: [/* { title: '', releaseTypes: [releaseTypesIds], wasDisterbuted: false } */],
    releaseTypes: [/* { name: '', id: '', dataFieldsLocalFilePath: '', fileUrl: '', dataFieldsStr: 'JSON STRING FON NOW' } */],

    templates: [/* { name: '', type: enum('0' => page, '1' => email), releaseTypes: [releaseTypesIds], handlebarsLocalFilePath: '', url: '', id: '', hadlebarsFileStr: ', appName: '' , previewUrl: 'NOT_IN_USE' } */],

    // subfilters: [/* { name: '', optionns: [{title:'', value: ''}], hideOnFilters: [releaseTyIds] } */],
    folders: [/* { name: '', children: [folders], content: [] } */],
    logos: [/* {url: '', id: '', title: ''} */]
  }
}
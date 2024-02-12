import { httpService } from '@/apps/common/modules/common/services/http.service';
import { templateUtils } from '../../common/services/template.util.service';

const ENDPOINT = 'organization';

export const organizationService = {
  // query,
  // get,
  // add,
  // update,
  // save,
  // remove,
  getEmptyOrganization,

  loadReleaseDataFields
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

function loadReleaseDataFields(dataFieldsLocalFilePath, organizationId, releaseType) {
  return httpService.get(`${ENDPOINT}/${organizationId}/releaseDataFields`, { dataFieldsLocalFilePath, releaseType });
}



function getEmptyOrganization() { // todo
  return {
    name: '',
    logoUrl: '',
    defaultGalleryCredit: '',
    distributionBcc: '',
    domain: '',
    fromEmails: [/* { email: '', title: '' } */],
    // filters: [/* { title: '', releaseTypes: [releaseTypesIds], wasDisterbuted: false } */],
    // releaseTypes: [/* { name: '', id: '', dataFieldsLocalFilePath: '', fileUrl: '', dataFieldsStr: 'NOT IN USE ___ JSON STRING FON NOW' } */],

    routes: JSON.parse(JSON.stringify(templateUtils.DEFAULY_TEMPLATES_DATA.routes)),
    releaseTypes: JSON.parse(JSON.stringify(templateUtils.DEFAULY_TEMPLATES_DATA.releaseTypes)),


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
  }
}
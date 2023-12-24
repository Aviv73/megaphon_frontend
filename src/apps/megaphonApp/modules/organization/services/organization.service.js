import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'organization';

export const organizationService = {
  query,
  get,
  add,
  update,
  save,
  remove,
  getEmptyOrganization,

  loadDataFields
}

function query(filterBy) {
  return httpService.get(ENDPOINT, filterBy);
}
function get(id) {
  if (!id) return getEmptyOrganization();
  return httpService.get(`${ENDPOINT}/${id}`);
}
function add(item) {
  return httpService.post(ENDPOINT, item);
}
function update(item) {
  return httpService.put(ENDPOINT, item);
}
function remove(id) {
  return httpService.delete(`${ENDPOINT}/${id}`);
}
function save(item) {
  return item._id? update(item) : add(item);
}

function loadDataFields(dataFieldsLocalFilePath, organizationId, releaseType) {
  return httpService.get(`${ENDPOINT}/${organizationId}/dataFields`, { dataFieldsLocalFilePath, releaseType });
}



function getEmptyOrganization() { // todo
  return {
    name: '',
    logoUrl: '',
    defaultGalleryCredit: '',
    distributionBcc: '',
    fromEmails: [/* { email: '', title: '' } */],
    // filters: [/* { title: '', releaseTypes: [releaseTypesIds], wasDisterbuted: false } */],
    // releaseTypes: [/* { name: '', id: '', dataFieldsLocalFilePath: '', fileUrl: '', dataFieldsStr: 'NOT IN USE ___ JSON STRING FON NOW' } */],

    "filters" : [ 
      {
          "id" : "DEFAULT_SIMPLE",
          "title" : "פשוטים",
          "releaseTypes" : [
              "DEFAULT_SIMPLE"
          ],
          "showInClient" : true
      }, 
      {
          "id" : "DEFAULT_GROUP",
          "title" : "קבוצתיים",
          "releaseTypes" : [
              "DEFAULT_GROUP"
          ],
          "showInClient" : true
      }
    ],
    "releaseTypes" : [ 
        {
            "name" : "פשוט",
            "id" : "DEFAULT_SIMPLE",
            "dataFieldsStr" : "",
            "isGroup" : false
        }, 
        {
            "name" : "קבוצתי",
            "id" : "DEFAULT_GROUP",
            "dataFieldsStr" : "",
            "isGroup" : true
        }
    ],


    templates: [/* { name: '', type: enum('0' => page, '1' => email), releaseTypes: [releaseTypesIds], handlebarsLocalFilePath: '', url: '', id: '', hadlebarsFileStr: 'NOT IN USE', appName: '' , previewUrl: 'NOT_IN_USE' } */],

    // subfilters: [/* { name: '', optionns: [{title:'', value: ''}], hideOnFilters: [releaseTyIds] } */],
    folders: [/* { name: '', children: [folders], content: [] } */],
    logos: [/* {url: '', id: '', title: ''} */],
    designPreferences: {
      color: 'black',
      bgColor: 'white'
    },
  }
}
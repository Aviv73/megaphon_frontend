const DEFAULY_TEMPLATES_DATA = _getDefaultTEmplatesData();
const exportItems = {
  DEFAULY_TEMPLATES_DATA,
  getReleaseLandingPageUrl,
  getReleaseRelevantTemplateItem,
  getAllRelevantTemplatesForReleaseType,
  getAllDefaultTemplatesForReleaseType,
  getRelevantReleaseTypeItemForRelease,
  getAllReleaseTypesForOrg
}

// /* FOR NODE ENV:: */
// const config = require("../config");
// module.exports = { templateUtils: exportItems };

/* FOR ES6 ENV:: */
import config from '@/config';
export const templateUtils = exportItems;


function getReleaseLandingPageUrl(release, organization, isNews) {
  const template = getReleaseRelevantTemplateItem(release, organization, isNews);
  if (template?.url) { // if outer site url, like ho1/hot8;
    let pageUrl = template?.url || '';
    pageUrl = pageUrl.split('${DOMAIN}').join(config.baseServerUrl);
    pageUrl = pageUrl.split('${releaseId}').join(release._id);
    return pageUrl;
  } 
  let url = '';
  if (template?.handlebarsLocalFilePath) { // if giving local handlebars file
    url = `${config.baseApiUrl}/client/${organization._id}/${isNews ? 'newsletter/' : ''}${release._id}`;
  } else { // if using vueJs app
    if (!isNews) {
      url = `${config.baseServerUrl}/client/${organization._id}/#/release/${release._id}`;
    } else {
      url = `${config.baseApiUrl}/client/${organization._id}/${isNews ? 'newsletter/' : ''}${release._id}`;
    }
  }
  // if (template?.appName) { // nested domain;
  //   url = url.split(organization._id).join(template.appName);
  // }
  if (organization?.domain) { // nested domain;
    url = url.split(organization._id).join(organization.domain);
  }
  return url;
}

function getReleaseRelevantTemplateItem(release, organization, isNews) {
  const allTemplatesToSearch = [...organization.templates, ...DEFAULY_TEMPLATES_DATA.templates];
  const selectedTemplateId = release.design[isNews? 'email' : 'landingPage'];
  if (selectedTemplateId && (typeof(selectedTemplateId) === 'string') && allTemplatesToSearch.find(c => c.id === selectedTemplateId)) return allTemplatesToSearch.find(c => c.id === selectedTemplateId);
  // return getAllRelevantTemplatesForReleaseType(release.releaseType, organization, isNews, true)[0];
  return getAllRelevantTemplatesForReleaseType(
    getRelevantReleaseTypeItemForRelease(release.releaseType, organization).id,
    organization, isNews, true
  )[0];
}

function getAllRelevantTemplatesForReleaseType(releaseTypeId, organization, isNews, withDefaults = true) {
  const type = isNews? '1' : '0';
  const templates = organization.templates
        .filter(c => c.type == type)
        .filter(c => c.releaseTypes.includes(releaseTypeId));
  if (withDefaults) {
    templates.push(
      // ...getAllDefaultTemplatesForReleaseType(organization.releaseTypes.find(c => c.id === releaseTypeId), isNews)
      ...getAllDefaultTemplatesForReleaseType(getRelevantReleaseTypeItemForRelease(releaseTypeId, organization), isNews)
    );
  }
  return templates;
}

function getAllDefaultTemplatesForReleaseType(releaseTypeItem, isNews) {
  const isGroup = releaseTypeItem.isGroup;
  const defaultReleaseTypeIds = DEFAULY_TEMPLATES_DATA.releaseTypes.filter(c => c.isGroup === isGroup).map(c => c.id);
  const defaultTemplatesToSearch = DEFAULY_TEMPLATES_DATA.templates.filter(c => c.releaseTypes.find(type => defaultReleaseTypeIds.includes(type)));
  const type = isNews? '1' : '0';
  const templates = defaultTemplatesToSearch
        .filter(c => c.type == type);
  return templates;
}


function getRelevantReleaseTypeItemForRelease(releaseTypeId, organization) {
  const allTypeItems = getAllReleaseTypesForOrg(organization);
  const releaseTypeItem = allTypeItems.find(c => c.id === releaseTypeId);
  if (!releaseTypeItem.followReleaseType) return releaseTypeItem;
  return allTypeItems.find(c => c.id === releaseTypeItem.followReleaseType);
}

function getAllReleaseTypesForOrg(organization) {
  return [
    ...organization.releaseTypes,
    ...DEFAULY_TEMPLATES_DATA.releaseTypes
  ]
}

function _getDefaultTEmplatesData() {
  return {
    "releaseTypes" : [
      {
          "name" : "רליס דיפולטיבי פשוט",
          "id" : "DEFAULT_SIMPLE_RELEASE",
          "dataFieldsStr" : "",
          "isGroup" : false,
          dataFieldsLocalFilePath: 'default/templates/simple/default.simple.datafields'
      },
      {
          "name" : "רליס דיפולטיבי קבוצתי",
          "id" : "DEFAULT_GROUP_RELEASE",
          "dataFieldsStr" : "",
          "isGroup" : true,
          dataFieldsLocalFilePath: 'default/templates/group/default.group.datafields'
      }
    ],
    "templates": [
      {
          "name" : "דיפולטיבי - רליס פשוט",
          "id" : "DEFAULT_SIMPLE_LANDINGPAGE",
          "type" : "0", // landing page
          isNews: false,
          "releaseTypes" : [ 
              "DEFAULT_SIMPLE_RELEASE"
          ],
          "appName" : ""
      },
      {
          "name" : "דיפולטיבי - רליס קבוצתי",
          "id" : "DEFAULT_GROUP_LANDINGPAGE",
          "type" : "0",
          isNews: false,
          "releaseTypes" : [ 
              "DEFAULT_GROUP_RELEASE"
          ],
          "appName" : ""
      },
      {
          "name" : "דיפולטיבי - ניוזלטר רליס קבוצתי",
          "id" : "DEFAULT_GROUP_NEWSLETTER",
          "type" : "1",
          isNews: true,
          "releaseTypes" : [ 
              "DEFAULT_GROUP_RELEASE"
          ],
          // "handlebarsLocalFilePath" : "default/templates/group/default.group.email"
          "handlebarsLocalFilePath" : "default/templates/simple/default.simple.email"
      },
      {
          "name" : "דיפולטיבי - ניוזלטר רליס פשוט",
          "id" : "DEFAULT_SIMPLE_NEWSLETTER",
          "type" : "1",
          isNews: true,
          "releaseTypes" : [ 
              "DEFAULT_SIMPLE_RELEASE"
          ],
          "handlebarsLocalFilePath" : "default/templates/simple/default.simple.email"
      }
    ],
  
    "routes" : [
      {
          // "name" : "פשוטים",
          "name" : "רליסים",
          "id" : "DEFAULT_SIMPLE_ROUTE",
          "releaseFilter" : {
              "releaseTypes" : [ 
                  "DEFAULT_SIMPLE_RELEASE"
              ]
          },
          "showInClient" : true,
          "htmlContentFilePath" : ""
      },
      {
          // "name" : "קבוצתיים",
          "name" : "רליסים קבוצתיים",
          "id" : "DEFAULT_GROUP_ROUTE",
          "releaseFilter" : {
              "releaseTypes" : [ 
                  "DEFAULT_GROUP_RELEASE"
              ]
          },
          "showInClient" : true,
          "htmlContentFilePath" : ""
      }
    ]
  }
}

import config from '@/config';
// const serverBaseUrl = location.origin || config.baseApiUrl;
const serverBaseUrl = config.baseApiUrl;
const origin = location.origin;
// console.log(location.origin)

export function getReleaseLandingPageUrl(release, organization, isNews) {
  const template = getReleaseRelevantTmplate(release, organization, isNews);
  // if (!template) return '';
  if (template?.url) { // if outer site url
    let pageUrl = template?.url || '';
    pageUrl = pageUrl.split('${releaseId}').join(release._id);
    return pageUrl;
  } 
  let url = '';
  if (template?.handlebarsLocalFilePath) { // if giving local handlebars file
    // const pageUrl = `${serverBaseUrl}/release/${organization.appName || organization._id}/${isNews ? 'newsletter' : 'client'}/${release._id}`;
    url = `${serverBaseUrl}client/${organization.appName || organization._id}/${isNews ? 'newsletter/' : ''}${release._id}`;
  } else { // if using vueJs app
    url = `${origin}/client/${organization._id}/#/release/${release._id}`;
  }
  if (template?.appName) { // nested domain;
    url = url.split(organization._id).join(template.appName);
  }
  return url;
}

export function getReleaseRelevantTmplate(release, organization, isNews) {
  const type = isNews? '1' : '0';
  const templates = organization.templates
        .filter(c => c.type == type)
        .filter(c => c.releaseTypes.includes(release.releaseType));
  return templates[0];
}

export async function uploadImg(fileData) { // { src, name };
  return fileData
}
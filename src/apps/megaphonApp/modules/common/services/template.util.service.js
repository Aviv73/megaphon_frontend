
import config from '@/config';
// const serverBaseUrl = location.origin || config.baseApiUrl;
const serverBaseUrl = config.baseApiUrl;
const origin = location.origin;

export function getReleaseLandingPageUrl(release, organization, isNews) {
  const template = getReleaseRelevantTemplate(release, organization, isNews);
  // if (!template) return '';
  if (template?.url) { // if outer site url
    let pageUrl = template?.url || '';
    pageUrl = pageUrl.split('${releaseId}').join(release._id);
    return pageUrl;
  } 
  let url = '';
  if (template?.handlebarsLocalFilePath) { // if giving local handlebars file
    // const pageUrl = `${serverBaseUrl}/release/${organization.appName || organization._id}/${isNews ? 'newsletter' : 'client'}/${release._id}`;
    url = `${serverBaseUrl}client/${organization._id}/${isNews ? 'newsletter/' : ''}${release._id}`;
  } else { // if using vueJs app
    if (!isNews) {
      url = `${origin}/client/${organization._id}/#/release/${release._id}`;
    } else {
      url = `${serverBaseUrl}client/${organization._id}/${isNews ? 'newsletter/' : ''}${release._id}`;
    }
  }
  if (template?.appName) { // nested domain;
    url = url.split(organization._id).join(template.appName);
  }
  return url;
}

export function getReleaseRelevantTemplate(release, organization, isNews) {
  const selectedTEmplate = release.design[isNews? 'email' : 'landingPage'];
  if (selectedTEmplate && (typeof(selectedTEmplate) === 'string') && organization.templates.find(c => c.id === selectedTEmplate)) return organization.templates.find(c => c.id === selectedTEmplate);
  const type = isNews? '1' : '0';
  const templates = organization.templates
        .filter(c => c.type == type)
        .filter(c => c.releaseTypes.includes(release.releaseType));
  return templates[0];
}

export async function uploadImg(fileData) { // { src, name };
  return fileData
}

const [root, subDomain] = location.pathname.split('/').filter(Boolean);  // /client/agam;
const allParts = [root, subDomain].filter(Boolean);

var client;
if (allParts.length < 2) client = false;
else client = true;

var appOrganizationId = null;
var singleOrgMode = false;
if (allParts.length === 1) {
  // appOrganizationId = root;
  // singleOrgMode = true;
}

console.log('INITIALIZING APP', subDomain);

export default {
  pathname: location.pathname,
  client,
  subDomain,
  appOrganizationId,
  singleOrgMode
}
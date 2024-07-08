
const [root, subDomain] = location.pathname.split('/').filter(Boolean);  // /client/agam;

var client;
if ([root, subDomain].filter(Boolean).length < 2) client = false;
else client = true;

console.log('INITIALIZING APP', subDomain);

export default {
  pathname: location.pathname,
  client,
  subDomain
}
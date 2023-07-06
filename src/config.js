
const [root, appName] = location.pathname.split('/').filter(Boolean);  // /client/agam;

var client;

if ([root, appName].filter(Boolean).length < 2) client = false;
else client = true;

console.log('INITIALIZING APP', appName);

export default {
  client,
  appName
}
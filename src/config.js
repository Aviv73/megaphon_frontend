
const appName = location.pathname.split('/').filter(Boolean).pop();

console.log('INITIALIZING APP', appName);

export default {
  appName
}
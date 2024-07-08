import appConfig from '../appConfig.js';
import megaphonAppData from './megaphonApp';
import AgamAppData from './clientApps/agam';
import CellcomTvAppData from './clientApps/cellcom-tv';
import DefaultClientAppData from './clientApps/defaultApp';
// DefaultClientAppData.params.organizationId = appConfig.appName;

const costumeClientApps = [AgamAppData, CellcomTvAppData];

export default (() => {
  if (appConfig.client) {
    // return costumeClientApps.find(c => c.params.appName === appConfig.appName) || { ...DefaultClientAppData, params: {...DefaultClientAppData.params, organizationId: appConfig.appName} };
    // return costumeClientApps.find(c => c.params.appName === appConfig.appName) || DefaultClientAppData;
    const app = costumeClientApps.find(c => c.params.appName === getAppNameFromDomain(appConfig.subDomain)) || DefaultClientAppData;
    // app.params.organizationId = appConfig.appName;
    app.params.organizationId = appConfig.subDomain;
    app.params.subDomain = appConfig.subDomain;
    return app;
  }
  return megaphonAppData;
  // if (appConfig.appName) {
  //   switch (appConfig.appName) {
  //     case 'agam': return AgamAppData
  //   }
  // }
})();

function getAppNameFromDomain(domainName) {
  const data = [
    {
      appName: 'agam-client',
      domains: ['agam']
    },
    {
      appName: 'cellcom-tv-app',
      domains: ['cellcom-tv']
    }
  ];
  console.log(domainName, data.find(c => c.domains.includes(domainName))?.appName);
  return data.find(c => c.domains.includes(domainName))?.appName || '';
}
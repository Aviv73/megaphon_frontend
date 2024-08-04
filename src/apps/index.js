import appConfig from '../appConfig.js';
import megaphonAppData from './megaphonApp';
import AgamAppData from './clientApps/agam';
import StreamTvAppData from './clientApps/stream-tv';
import DefaultClientAppData from './clientApps/defaultApp';
// DefaultClientAppData.params.organizationId = appConfig.appName;

export const ClientApps = [DefaultClientAppData, AgamAppData, StreamTvAppData];

// export default getSelectedAppData;

export function getSelectedAppData(appName) {
  console.log('GETTING APP', appName);
  if (appConfig.client) {
    // const app = ClientApps.find(c => c.name === getAppNameFromDomain(appConfig.subDomain)) || DefaultClientAppData;
    const app = ClientApps.find(c => appName === c.name) || DefaultClientAppData;
    if (!app.params) app.params = {};
    app.params.organizationId = appConfig.subDomain;
    app.params.subDomain = appConfig.subDomain;
    return app;
  }
  return megaphonAppData;
}

// function getAppNameFromDomain(domainName) {
//   const data = [
//     {
//       appName: 'agam-client',
//       domains: ['agam']
//     },
//     {
//       appName: 'stream-tv-app',
//       domains: ['cellcom-tv']
//     }
//   ];
//   return data.find(c => c.domains.includes(domainName))?.appName || '';
// }
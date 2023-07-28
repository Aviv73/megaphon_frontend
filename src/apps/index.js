import appConfig from '../appConfig.js';
import megaphonAppData from './megaphonApp';
import AgamAppData from './clientApps/agam';
import DefaultClientAppData from './clientApps/defaultApp';

const costumeClentApps = [AgamAppData];

export default (() => {
  if (appConfig.client) {
    return costumeClentApps.find(c => c.params.appName === appConfig.appName) || { ...DefaultClientAppData, params: {...DefaultClientAppData.params, organizationId: appConfig.appName} };
  }
  return megaphonAppData;
  // if (appConfig.appName) {
  //   switch (appConfig.appName) {
  //     case 'agam': return AgamAppData
  //   }
  // }
})();
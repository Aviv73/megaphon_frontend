import appConfig from '../config.js';
import AgamAppData from './agam';
import DefaultAppData from './defaultApp';

const costumeApps = [AgamAppData];

export default (() => {
  return costumeApps.find(c => c.params.appName === appConfig.appName) || { ...DefaultAppData, params: {...DefaultAppData.params, organizationId: appConfig.appName} };
  // if (appConfig.appName) {
  //   switch (appConfig.appName) {
  //     case 'agam': return AgamAppData
  //   }
  // }
})();
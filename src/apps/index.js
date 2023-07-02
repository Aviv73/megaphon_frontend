import appConfig from '../config.js';
import AgamAppData from './agam';


export default (() => {
  if (appConfig.appName) {
    switch (appConfig.appName) {
      case 'agam': return AgamAppData
    }
  }
})();

import config from '@/config';
export const scripts = {};
// loading the script file from the server so it is writen only once;
var scriptsDataToLoad = [];
// use in local service files where needs to load from server;
export function appendScript(scriptEndpoint = '', scriptKey = '', loadOn = {}) {
  scriptsDataToLoad.push({ scriptEndpoint, scriptKey, loadOn });
}
// use in root app file to load all scripts;
export async function loadScripts() {
  await Promise.all(scriptsDataToLoad.map(loadScript));
  scriptsDataToLoad = [];
}
export async function loadScript({ scriptEndpoint, scriptKey, loadOn }) {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'text/javascript';
    scriptElement.src = config.baseApiUrl + scriptEndpoint;
    scriptElement.onload = () => {
      const scriptModule = window[scriptKey];
      window[scriptKey] = null;
      document.head.removeChild(scriptElement);
      for (let key in scriptModule.templateUtils) {
        loadOn[key] = scriptModule.templateUtils[key];
      }
      scripts[scriptKey] = scriptModule;
      resolve(loadOn);
    }
    scriptElement.onerror = (err) => {
      console.log('Had error loading script file', scriptKey);
      reject();
    }
    document.head.appendChild(scriptElement);
    // return loadOn;
  })
}
export const templateUtils = {};

// loading the script file from the server so it is writen only once;
import config from '@/config';
(async () => {
  // const scriptContent = await fetch(config.baseServerUrl + '/scripts/template-util-service').then(res => res.text());
  const scriptElement = document.createElement('script');
  scriptElement.type = 'text/javascript';
  scriptElement.src = config.baseServerUrl + '/scripts/template-util-service';
  scriptElement.onload = () => {
    const templateUtilsModule = window.templateUtilsModule;
    window.templateUtilsModule = null;
    document.head.removeChild(scriptElement);
    for (let key in templateUtilsModule.templateUtils) {
      templateUtils[key] = templateUtilsModule.templateUtils[key];
    }
  }
  document.head.appendChild(scriptElement);
})();
import { appendScript } from "./loadScript.service";
export const templateUtils = {};
// loading the script file from the server so it is writen only once;
appendScript('/template-util-service', 'templateUtilsModule', templateUtils, (serv) => {
  for (let key in serv.templateUtils) templateUtils[key] = serv.templateUtils[key];
});
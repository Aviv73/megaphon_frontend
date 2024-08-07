import { appendScript } from "./loadScript.service";
export const templateUtils = {};
// loading the script file from the server so it is writen only once;
appendScript('/scripts/template-util-service', 'templateUtilsModule', templateUtils);
import { appendScript } from "./loadScript.service";
export const consts = {};
// loading the script file from the server so it is writen only once;
appendScript('/const-service', 'constModule', consts);
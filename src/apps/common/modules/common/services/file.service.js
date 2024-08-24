import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'file';

import config from '@/config';
const BASE_URL = config.baseApiUrl

export const fileService = {
  uploadFileToServer
}

import { appendScript } from "./loadScript.service";
export const fileUtilsService = {};
// loading the script file from the server so it is writen only once;
appendScript('/fileUtils-service', 'fileUtilsModule', fileUtilsService);


export function fixFileSrcToThumbnail(url = '') {
  return fileUtilsService.fixFileSrcToThumbnail(url, config);
}

export function fixVideoSrcToThumbnail(url = '', organizationId = '') {
  return fileUtilsService.fixVideoSrcToThumbnail(url, organizationId, config);
}


export function uploadFileToServer(formData, organizationId) {
  return httpService.post(`${ENDPOINT}/upload/${organizationId}`, formData);
}

export function loadStaticFile(filePath) {
  return httpService.get(`${ENDPOINT}/static-file`, { filePath });
}
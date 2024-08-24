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


export function fixFileSrcToThumbnail(file = {}) {
  return fileUtilsService.fixFileSrcToThumbnail(file, config);
}

export function fixVideoSrcToThumbnail(file = {}, organizationId = '') {
  return fileUtilsService.fixVideoSrcToThumbnail(file, organizationId, config);
}


export function uploadFileToServer(formData, organizationId, parentData) {
  return httpService.post(`${ENDPOINT}/upload/${organizationId}`, formData, {parentData});
}

export function loadStaticFile(filePath) {
  return httpService.get(`${ENDPOINT}/static-file`, { filePath });
}
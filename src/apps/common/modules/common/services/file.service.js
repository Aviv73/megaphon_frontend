import { httpService } from '@/apps/common/modules/common/services/http.service';
import { socketService } from '@/apps/common/modules/common/services/socket.service';

const ENDPOINT = 'file';

import config from '@/config';
const BASE_URL = config.baseApiUrl

export const fileService = {
  uploadFileToServer
}

import { appendScript } from "./loadScript.service";
import { getRandomId } from './util.service';
export const fileUtilsService = {};
// loading the script file from the server so it is writen only once;
appendScript('/fileUtils-service', 'fileUtilsModule', fileUtilsService);


export function fixFileSrcToThumbnail(file = {}, rootData) {
  return fileUtilsService.getFileThumbnailUrlFromRootData(file, rootData);
  // return fileUtilsService.getFileThumbUrl(file, config);
}

export function fixVideoSrcToThumbnail(file = {}, rootData, organizationId = '') {
  return fileUtilsService.getFileThumbnailUrlFromRootData(file, rootData);
  // return fileUtilsService.getVideoThumbUrl(file, organizationId, config);
}


export function uploadFileToServer(file, organizationId, parentData) {
  const formData = new FormData();
  formData.append('file', file);
  const fileSize = file.size;
  return httpService.post(`${ENDPOINT}/upload/${organizationId}`, formData, {parentData, isFullFile: true, fileSize});
}

export async function chunkUploadFileToServer(file, organizationId, parentData, onChunkEndCb = (uploadStats) => {}) {
  const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB;

  const fileSize = file.size;
  const originalName = file.name;

  const lastDotIdx = file.name.lastIndexOf('.');
  const type = lastDotIdx > -1 ? file.name.substring(lastDotIdx+1) : file.mimetype?.split('/').pop();
  const storeFileName = `file-${getRandomId()}.${type}`;
  
  // const prms = [];
  let uploadId;
  let res;
  let uploadedBytes = 0;
  let socketRoom = '';
  const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);  
  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = start + CHUNK_SIZE;
    const chunk = file.slice(start, end);
    const formData = new FormData();
    formData.append('file', chunk);
    const params = {parentData, fileSize, totalChunks, uploadId, chunkIdx: i, storeFileName, originalName};
    if (!i) params.isFirst = true;
    if (i === totalChunks - 1) params.isLast = true;
    const prm = httpService.post(`${ENDPOINT}/upload/${organizationId}`, formData, params);
    const currRes = await prm;
    if (!i) { // if firstTime, if no uploadId
      // res = currRes;
      uploadId = currRes.uploadId;
    } 

    uploadedBytes += CHUNK_SIZE;
    onChunkEndCb?.({ uploadedBytes, totalSize: fileSize, percents: Math.min((uploadedBytes / fileSize)*100, 100), msg: '' });

    if (i === totalChunks - 1) {
      // res = currRes;
      socketRoom = currRes.socketRoom;
      socketService.emit('join-room', socketRoom);
      onChunkEndCb?.({ uploadedBytes, totalSize: fileSize, percents: Math.min((uploadedBytes / fileSize)*100, 100), msg: 'encrypting' });
      res = await (new Promise((resolve, reject) => {
        socketService.on('encryption-finished', data => resolve(data));
      }));
    } else {
    }
    // prms.push(prm);
    uploadedBytes += CHUNK_SIZE;
  }
  // await Promise.all(prms);
  return res;
}

export function loadStaticFile(filePath) {
  return httpService.get(`${ENDPOINT}/static-file`, { filePath });
}

export function getVideoEncryptionKey(token) {
  return httpService.get(`${ENDPOINT}/encryption-key`, { });
}
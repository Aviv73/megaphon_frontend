import { httpService } from '@/apps/common/modules/common/services/http.service';
// import { socketService } from '@/apps/common/modules/common/services/socket.service';

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
  const CHUNK_SIZE = 1024 * 1024 * 20; // 20MB;

  const fileSize = file.size;
  const originalName = file.name;

  const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);  

  const lastDotIdx = file.name.lastIndexOf('.');
  const type = lastDotIdx > -1 ? file.name.substring(lastDotIdx+1) : file.mimetype?.split('/').pop();
  const storeFileName = `file-${getRandomId()}.${type}`;
  
  const prms = [];
  const baseParams = {parentData, fileSize, totalChunks, storeFileName, originalName, chunkSize: CHUNK_SIZE};
  let uploadId;
  const chunkByChunkMode = false;
  if (!chunkByChunkMode) uploadId = await httpService.post(`${ENDPOINT}/openMultipartUpload/${organizationId}`, null, baseParams);
  let res;
  let uploadedBytes = 0;
  let socketRoom = '';
  // const isEncryptionMode = false;
  let doneChunksCount = 0;
  for (let i = 0; i < totalChunks; i++) {
    const doIt = async () => {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, fileSize);
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('file', chunk);
      const params = {...baseParams, uploadId, chunkIdx: i, range: {start, end}, chunkByChunkMode};
      if (!i) params.isFirst = true;
      if (i === totalChunks - 1) params.isLast = true;
      const currRes = await httpService.post(`${ENDPOINT}/upload/${organizationId}`, formData, params);
      if (!uploadId) { // if firstTime, if no uploadId
        // res = currRes;
        uploadId = currRes.uploadId;
      } 
  
      uploadedBytes += CHUNK_SIZE;
      doneChunksCount++;
      // onChunkEndCb?.({ uploadedBytes, totalSize: fileSize, percents: Math.min((uploadedBytes / fileSize)*100, 100), msg: '' });
      onChunkEndCb?.({ uploadedBytes, totalSize: fileSize, percents: Math.min((doneChunksCount / totalChunks)*100, 100), msg: '' });
  
      if (i === totalChunks - 1) {
        if (chunkByChunkMode) {
          res = currRes;
        }
        // if (isEncryptionMode) {
        //   socketRoom = currRes.socketRoom;
        //   // socketService.emit('join-room', socketRoom);
        //   onChunkEndCb?.({ uploadedBytes, totalSize: fileSize, percents: Math.min((uploadedBytes / fileSize)*100, 100), msg: 'encrypting' });
        //   res = await (new Promise((resolve, reject) => {
        //     // socketService.on('encryption-finished', data => resolve(data));
        //   }));
        // }
      } else {
      }
    }
    const prm = doIt();
    if (chunkByChunkMode) await prm;
    else prms.push(prm);
    // uploadedBytes += CHUNK_SIZE;
  }
  if (!chunkByChunkMode) {
    await Promise.all(prms);
    console.log('WOW?');
    res = await httpService.post(`${ENDPOINT}/closeMultipartUpload/${organizationId}`, null, {...baseParams, uploadId});
  }
  return res;
}

export function loadStaticFile(filePath) {
  return httpService.get(`${ENDPOINT}/static-file`, { filePath });
}
export function loadCostumeHtml(orgId, filePath) {
  return httpService.get(`${ENDPOINT}/costumeHtml/${orgId}`, { filePath });
}

export function getVideoEncryptionKey(token) {
  return httpService.get(`${ENDPOINT}/encryption-key`, { });
}


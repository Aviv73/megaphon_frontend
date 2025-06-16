import { httpService } from '@/apps/common/modules/common/services/http.service';
// import { socketService } from '@/apps/common/modules/common/services/socket.service';
import { appendScript } from "./loadScript.service";
import { Utils } from './util.service';
import { TaskManager } from './TaskManager';

const ENDPOINT = 'file';

import config from '@/config';
const BASE_URL = config.baseApiUrl

export const fileUtilsService = {};
export const fileService = {
  uploadFileToServer,
  fileUtilsService
}

// loading the script file from the server so it is writen only once;
appendScript('/fileUtils-service', 'fileUtilsModule', fileUtilsService);


export function getFileError(file = {}, rootData) {
  return fileUtilsService.getFileError(file, rootData);
}
export function getFileItemFromRootItem(file = {}, rootData) {
  return fileUtilsService.getFileItemFromRootItem(file, rootData);
}
export function fixFileSrcToThumbnail(file = {}, rootData) {
  return fileUtilsService.getFileThumbnailUrlFromRootData(file, rootData, config);
  // return fileUtilsService.getFileThumbUrl(file, config);
}

export function fixVideoSrcToThumbnail(file = {}, rootData, organizationId = '') {
  return fileUtilsService.getFileThumbnailUrlFromRootData(file, rootData, config);
  // return fileUtilsService.getVideoThumbUrl(file, organizationId, config);
}
// export function getTotalTimeWatchedPerVideoWatchLog(vidLog) {
//   return fileUtilsService.getTotalTimeWatchedPerVideoWatchLog(vidLog);
//   // return fileUtilsService.getVideoThumbUrl(file, organizationId, config);
// }
// export function checkIfLogCounts(vidLog) {
//   return fileUtilsService.checkIfLogCounts(vidLog);
//   // return fileUtilsService.getVideoThumbUrl(file, organizationId, config);
// }


export function uploadFileToServer(file, organizationId, parentData) {
  const formData = new FormData();
  formData.append('file', file);
  const fileSize = file.size;
  return httpService.post(`${ENDPOINT}/upload/${organizationId}`, formData, {parentData, isFullFile: true, fileSize});
}

export async function chunkUploadFileToServer(file, organizationId, parentData, onChunkEndCb = (uploadStats) => {}) {
  console.time('UPLOAD TIME');
  const CHUNK_SIZE = 1024 * 1024 * 10; // 10MB;

  const fileSize = file.size;
  const originalName = file.name;

  const totalChunks = Math.ceil(fileSize / CHUNK_SIZE);  

  const lastDotIdx = file.name.lastIndexOf('.');
  const type = lastDotIdx > -1 ? file.name.substring(lastDotIdx+1) : file.mimetype?.split('/').pop();
  const storeFileName = `file-${Utils.getRandomId()}.${type}`;

  
  const isVideo = ['mp4'].includes(type);
  let videoSecondsDuration = 0;
  if (isVideo && false) {
    videoSecondsDuration = await new Promise((resolve, reject) => {
      const videoUrl = URL.createObjectURL(file);
      const videoEl = document.createElement('video');
      videoEl.preload = 'metadata';
      videoEl.onloadedmetadata = () => {
        URL.revokeObjectURL(videoUrl);
        resolve(videoEl.duration)
      }
      videoEl.onerror = () => {
        console.error('Cant load video length');
        resolve(0)
      }
    });
  }
  
  const prms = [];
  const baseParams = {parentData, fileSize, videoSecondsDuration, totalChunks, storeFileName, originalName, chunkSize: CHUNK_SIZE};
  let uploadId;
  const chunkByChunkMode = true;
  if (!chunkByChunkMode) uploadId = await httpService.post(`${ENDPOINT}/openMultipartUpload/${organizationId}`, null, baseParams);
  let res;
  let uploadedBytes = 0;
  let socketRoom = '';
  // const isEncryptionMode = false;
  let doneChunksCount = 0;
  const tasker = new TaskManager(undefined, 1, 1);
  for (let i = 0; i < totalChunks; i++) {
    const doIt = async () => {
      console.log('ABOUT TO UPLOAD CHUNK', i + ' / ' + totalChunks);
      console.time('TIME CHUNK ' + i);
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
      console.log('UPLOADED CHUNK', i);
      console.timeEnd('TIME CHUNK ' + i);
    }
    // const prm = doIt();
    const prm = tasker.appendTask(doIt);
    if (chunkByChunkMode) await prm;
    else prms.push(prm);
    // uploadedBytes += CHUNK_SIZE;
  }
  if (!chunkByChunkMode) {
    await Promise.all(prms);
    res = await httpService.post(`${ENDPOINT}/closeMultipartUpload/${organizationId}`, null, {...baseParams, uploadId});
  }
  console.time('UPLOAD TIME');
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


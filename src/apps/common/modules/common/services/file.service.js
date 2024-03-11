import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'file';

export const fileService = {
  uploadFileToServer
}


export function uploadFileToServer(formData) {
  return httpService.post(`${ENDPOINT}/upload`, formData);
}

export function fixFileSrcToThumbnail(url = '') {
  // return url;
  return url.replace('megaphonecs.s3.amazonaws.com/uploads', 'images.megaphon.co.il');
}

export function loadStaticFile(filePath) {
  return httpService.get(`${ENDPOINT}/static-file`, { filePath });
}
import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'file';

export const fileService = {
  uploadFileToServer
}


export function  uploadFileToServer(formData) {
  return httpService.post(`${ENDPOINT}/upload`, formData);

}
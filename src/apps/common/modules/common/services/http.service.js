// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'api/'
//   // ? window.location.origin + '/better-api/'
//   : 'http://localhost:3000/api/';

import config from '@/config';
const BASE_URL = config.baseApiUrl;

export const httpService = new window.httpServiceModule.HttpService(BASE_URL);
httpService.delete = httpService.remove;
import { Utils } from './util.service';

import axios from 'axios';
axios.default.withCredentials = true;

// const BASE_URL = process.env.NODE_ENV === 'production'
//   ? 'api/'
//   // ? window.location.origin + '/better-api/'
//   : 'http://localhost:3000/api/';

import config from '@/config';
const BASE_URL = config.baseApiUrl


async function ajax(endpoint = '', method = 'get', data = {}, params = {}, headers = {}) {
  try {
    const res = await axios({
      url: BASE_URL + '/' + endpoint,
      method,
      data,
      params,
      headers,
      withCredentials: true
    });
    return res.data;
  } catch(err) {
    return _handleError(err);
  }
}

export const httpService = {
  url: BASE_URL,
  ajax,
  get: (endpoint, query) => ajax(endpoint, 'GET', {}, query),
  post: (endpoint, data, headers) => ajax(endpoint, 'POST', data, {}, headers),
  put: (endpoint, data) => ajax(endpoint, 'PUT', data),
  delete: (endpoint, data) => ajax(endpoint, 'DELETE', data),
  download,
  logToServer
}


async function download(endpoint, params) {
  const url = `${BASE_URL}/${endpoint}?${Utils.getQuerysStr(params)}`;
  // let fileName;
  // let blob;
  try {
      const res = await fetch(url, { credentials: 'include' });
      if (res.status !== 200) throw { ...await res.json(), status: res.status };

      const nameHeader = res.headers.get('content-disposition');
      const fileName = nameHeader.slice(nameHeader.indexOf('=') + 1);
      const blob = await res.blob();

      const objUrl = URL.createObjectURL(blob);
      const elLink = document.createElement('a');
      elLink.href = objUrl;
      elLink.download = fileName;
      elLink.click();
  } catch (err) {
      return _handleError(err);
  }

}

function logToServer(level, title, msg, data) {
  return ajax('log', 'POST', {level, title, msg, data});
}

function _handleError(err) {
  // console.error(err);
  // return err.response?.data || err;
  // throw err;
  throw err.response?.data || err;
}
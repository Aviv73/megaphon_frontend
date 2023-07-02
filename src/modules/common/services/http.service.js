import { Utils } from './util.service';

import axios from 'axios';
// axios.default.withCredentials = true;

const BASE_URL = process.env.NODE_ENV === 'production'
  // ? 'api/'
  ? window.location.origin + '/better-api/'
  : 'http://localhost:8080/better-api/';


async function ajax(endpoint = '', method = 'get', data = {}, params = {}, headers = {}) {
  try {
    const res = await axios({
      url: BASE_URL + endpoint,
      method,
      data,
      params,
      headers,
      // withCredentials: true
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
  download
}


async function download(endpoint, params) {
  const url = `${BASE_URL}${endpoint}${Utils.getQuerysStr(params)}`;
  let fileName;
  let blob;
  try {
      const res = await fetch(url, { credentials: 'include' });
      if (res.status !== 200) throw { ...await res.json(), status: res.status };

      const nameHeader = res.headers.get('content-disposition');
      fileName = nameHeader.slice(nameHeader.indexOf('=') + 1);
      blob = await res.blob();
  } catch (err) {
      return _handleError(err);
  }

  const objUrl = URL.createObjectURL(blob);
  const elLink = document.createElement('a');
  elLink.href = objUrl;
  elLink.download = fileName;
  elLink.click();
}

function _handleError(err) {
  // console.error(err);
  // return err.response?.data || err;
  // throw err;
  throw err.response?.data || err;
}
import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'auth';

export const authService = {
  login,
  getUserInfo,
  logout,
  signup,
  sendNewPasswordEmail,
  finishAuth
}

function login(cred, orgId = '') {
  return httpService.post(`${ENDPOINT}/login/${orgId}`, cred);
}
function finishAuth(pass) {
  return httpService.post(`${ENDPOINT}/finishAuth`, {pass});
}
function logout() {
  return httpService.post(`${ENDPOINT}/logout`);
}
function getUserInfo() {
  return httpService.get(`${ENDPOINT}/info`);
}
function signup(cred) {
  return httpService.post(`${ENDPOINT}/signup`, cred);
}
function sendNewPasswordEmail(email) {
  return httpService.post(`${ENDPOINT}/sendNewPasswordEmail`, {email});
}
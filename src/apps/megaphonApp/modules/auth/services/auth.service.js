import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'auth';

export const authService = {
  login,
  getUserInfo,
  logout,
  signup,
  sendNewPasswordEmail
}

function login(cred) {
  return httpService.post(`${ENDPOINT}/login`, cred);
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
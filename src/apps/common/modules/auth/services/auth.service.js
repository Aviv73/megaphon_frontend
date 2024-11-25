import { httpService } from '@/apps/common/modules/common/services/http.service';

const ENDPOINT = 'auth';

export const authService = {
  login,
  getUserInfo,
  logout,
  signup,
  sendNewPasswordEmail,
  finish2FactorAuth,
  makeSecondFactorAuthPass
}

function login(cred, orgId = '') {
  return httpService.post(`${ENDPOINT}/login/${orgId || ''}`, cred);
}
function logout() {
  return httpService.post(`${ENDPOINT}/logout`);
}
function getUserInfo() {
  return httpService.get(`${ENDPOINT}/info`);
}
function signup(cred, orgId = '') {
  return httpService.post(`${ENDPOINT}/signup/${orgId}`, cred);
}
function sendNewPasswordEmail(email) {
  return httpService.post(`${ENDPOINT}/sendNewPasswordEmail`, {email});
}
function finish2FactorAuth(pass, method) {
  return httpService.post(`${ENDPOINT}/finish2FactorAuth`, {pass, method});
}
function makeSecondFactorAuthPass(method) {
  return httpService.post(`${ENDPOINT}/makeSecondFactorAuthPass`, null, { method });
}
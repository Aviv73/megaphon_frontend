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

const ACCOUNT_SESSION_STORAGE_KEY = 'accountSessionOngoing';

async function login(cred, orgId = '') {
  const res = await httpService.post(`${ENDPOINT}/login/${orgId || ''}`, cred);
  reportSessionStart(res.user);
  return res;
}
async function logout() {
  const res = httpService.post(`${ENDPOINT}/logout`);
  sessionStorage.removeItem(ACCOUNT_SESSION_STORAGE_KEY);
  return res;
}
async function getUserInfo() {
  const res = await httpService.get(`${ENDPOINT}/info`);
  reportSessionStart(res);
  return res;
}
async function signup(cred, orgId = '') {
  const res = await httpService.post(`${ENDPOINT}/signup/${orgId}`, cred);
  reportSessionStart(res.user);
  return res;
}
async function sendNewPasswordEmail(email) {
  return httpService.post(`${ENDPOINT}/sendNewPasswordEmail`, {email});
}
async function finish2FactorAuth(pass, method) {
  const res = await httpService.post(`${ENDPOINT}/finish2FactorAuth`, {pass, method});
  reportSessionStart(res.user);
  return res;
}
async function makeSecondFactorAuthPass(method) {
  return httpService.post(`${ENDPOINT}/makeSecondFactorAuthPass`, null, { method });
}

async function reportSessionStart(account) {
  if (!account) return;
  if (sessionStorage[ACCOUNT_SESSION_STORAGE_KEY]) return;
  await httpService.post(`activity`, { 
    at: new Date(),
    title: 'clientSessionStart',
    category: 'clientSession',
    data: {},
    accountId: account._id,
  });
  sessionStorage[ACCOUNT_SESSION_STORAGE_KEY] = true;
}
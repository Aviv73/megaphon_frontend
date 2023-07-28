import appConfig from './appConfig'
import commonLocals from './apps/common/locals';
import selectedAppData from './apps/index.js';

export default {
  en: {
    ...commonLocals.en,
    ...selectedAppData.locales.en,
  },
  he: {
    ...commonLocals.he,
    ...selectedAppData.locales.he,
  },
  heF: {
    ...commonLocals.heF,
    ...selectedAppData.locales.heF,
  },
}
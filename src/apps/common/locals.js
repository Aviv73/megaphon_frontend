import { commonLocales } from './modules/common/locales';
import { settingsLocales } from './modules/settings/locales';
import { releaseLocales } from './modules/release/locales';
import { authLocales } from './modules/auth/locales';

export default {
  en: {
    ...commonLocales.en,
    ...settingsLocales.en,
    ...releaseLocales.en,
    ...authLocales.en,
  },
  he: {
    ...commonLocales.he,
    ...settingsLocales.he,
    ...releaseLocales.he,
    ...authLocales.he,
  },
  heF: {
    ...commonLocales.heF,
    ...settingsLocales.heF,
    ...releaseLocales.heF,
    ...authLocales.heF,
  },
}
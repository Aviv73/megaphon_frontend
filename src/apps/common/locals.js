import { commonLocales } from './modules/common/locales';
import { settingsLocales } from './modules/settings/locales';
import { releaseLocales } from './modules/release/locales';
import { authLocales } from './modules/auth/locales';
import { organizationLocales } from './modules/organization/locales';

export default {
  en: {
    ...commonLocales.en,
    ...settingsLocales.en,
    ...releaseLocales.en,
    ...authLocales.en,
    ...organizationLocales.en,
  },
  he: {
    ...commonLocales.he,
    ...settingsLocales.he,
    ...releaseLocales.he,
    ...authLocales.he,
    ...organizationLocales.he,
  },
  heF: {
    ...commonLocales.heF,
    ...settingsLocales.heF,
    ...releaseLocales.heF,
    ...authLocales.heF,
    ...organizationLocales.heF,
  },
}
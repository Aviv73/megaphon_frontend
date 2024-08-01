import { commonLocales } from './modules/common/locales';
import { settingsLocales } from './modules/settings/locales';
import { releaseLocales } from './modules/release/locales';

export default {
  en: {
    ...commonLocales.en,
    ...settingsLocales.en,
    ...releaseLocales.en,
  },
  he: {
    ...commonLocales.he,
    ...settingsLocales.he,
    ...releaseLocales.he,
  },
  heF: {
    ...commonLocales.heF,
    ...settingsLocales.heF,
    ...releaseLocales.heF,
  },
}
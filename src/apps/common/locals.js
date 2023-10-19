import { commonLocales } from './modules/common/locales';
import { settingsLocales } from './modules/settings/locales';

export default {
  en: {
    ...commonLocales.en,
    ...settingsLocales.en,
  },
  he: {
    ...commonLocales.he,
    ...settingsLocales.he,
  },
  heF: {
    ...commonLocales.heF,
    ...settingsLocales.heF,
  },
}
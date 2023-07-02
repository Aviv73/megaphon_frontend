import { commonLocales } from '@/modules/common/locales';
import { releaseLocales } from '@/modules/release/locales';
import { settingsLocales } from '@/modules/settings/locales';

export default {
  en: {
    ...commonLocales.en,
    ...releaseLocales.en,
    ...settingsLocales.en,
  },
  he: {
    ...commonLocales.he,
    ...releaseLocales.he,
    ...settingsLocales.he,
  },
  heF: {
    ...commonLocales.heF,
    ...releaseLocales.heF,
    ...settingsLocales.heF,
  },
}
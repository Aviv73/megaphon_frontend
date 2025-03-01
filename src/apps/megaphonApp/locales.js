import { commonLocales } from './modules/common/locales';
import { releaseLocales } from './modules/release/locales';
import { contactLocales } from './modules/contact/locales';
import { tagLocales } from './modules/tag/locales';
import { companyLocales } from './modules/company/locales';
import { accountLocales } from './modules/account/locales';
// import { authLocales } from './modules/auth/locales';
import { organizationLocales } from './modules/organization/locales';
import { statsLocales } from './modules/stats/locales';

export default {
  en: {
    ...commonLocales.en,
    ...releaseLocales.en,
    ...contactLocales.en,
    ...tagLocales.en,
    ...companyLocales.en,
    ...accountLocales.en,
    // ...authLocales.en,
    ...organizationLocales.en,
    ...statsLocales.en,
  },
  he: {
    ...commonLocales.he,
    ...releaseLocales.he,
    ...contactLocales.he,
    ...tagLocales.he,
    ...companyLocales.he,
    ...accountLocales.he,
    // ...authLocales.he,
    ...organizationLocales.he,
    ...statsLocales.he,
  },
  heF: {
    ...commonLocales.heF,
    ...releaseLocales.heF,
    ...contactLocales.heF,
    ...tagLocales.heF,
    ...companyLocales.heF,
    ...accountLocales.heF,
    // ...authLocales.heF,
    ...organizationLocales.heF,
    ...statsLocales.heF,
  },
}
// import { commonLocales } from './modules/common/locales';
import { releaseLocales } from './modules/release/locales';

const he = {
  // ...commonLocales.he,
  ...releaseLocales.he,
  "about": "אודות אגם",
  "allBooks": "לכל ספרי אגם",
  "archive": "ארכיון"
}

export default {
  en: {
    // ...commonLocales.en,
    ...releaseLocales.en,
    "about": "About Agam",
    "allBooks": "All books",
    "archive": "Archive"
  },
  he,
  heF: { ...he }
}
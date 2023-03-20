import Vue from 'vue';
import VueI18n from 'vue-i18n';

// import en from '@/assets/locales/en.js';
// import he from '@/assets/locales/he.js';

import messages from '@/assets/locales/index.js';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en', // being resetted in app.js
  messages: JSON.parse(JSON.stringify(messages))
  // messages: {
  //   en,
  //   he
  // }
});

export default i18n;
export const $t = str => i18n.t(str);
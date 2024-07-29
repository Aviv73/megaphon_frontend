// import commonStore from '../../common/store';

import locales from './locales';
import routes from './routes';
const store = {
  // ...commonStore
};
import app from './App.vue';

export default {
  name: 'agam-client',
  locales,
  routes,
  store,
  app,
  params: {
    // organizationId: '643eac15afc5d349300c087f',
    title: 'אגם הוצאה לאור'
  }
}
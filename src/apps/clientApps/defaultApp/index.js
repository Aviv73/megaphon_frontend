// import commonStore from '../../common/store';

import locales from './locales';
import routes from './routes';
const store = {
  // ...commonStore
};
import app from './App.vue';

export default {
  name: 'defaultApp',
  locales,
  routes,
  store,
  app,
  params: {
    organizationId: '',
    title: 'Megaphon - client'
  }
}
// import commonStore from '../../common/store';

import locales from './locales';
import routes from './routes';
const store = {
  // ...commonStore
};
import app from './App.vue';

export default {
  name: 'stream-tv-app',
  locales,
  routes,
  store,
  app,
  params: {
    organizationId: '',
    title: 'stream-tv'
  }
}
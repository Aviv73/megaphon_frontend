import locales from './locales';
import routes from './routes';
const store = {};
import app from './App.vue';

export default {
  locales,
  routes,
  store,
  app,
  params: {
    organizationId: '',
    appName: 'cellcom-tv-app',
    title: 'CellkomTv'
  }
}
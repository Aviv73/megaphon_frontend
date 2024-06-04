import locales from './locales';
import routes from './routes';
import store from './store';
import app from './App.vue';

export default {
  locales,
  routes,
  store,
  app,
  params: {
    organizationId: '',
    appName: 'megaphon',
    title: 'Megaphon'
  }
}
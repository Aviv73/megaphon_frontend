import locales from './locales';
import routes from './routes';
import store from './store';
import app from './App.vue';

export default {
  name: 'megaphon',
  locales,
  routes,
  store,
  app,
  params: {
    organizationId: '',
    title: 'Megaphon'
  }
}
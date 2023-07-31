import i18n from '@/plugins/i18n';
import '@/plugins/dnd';
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import { router } from './router'
import store from './store'

import './assets/styles/index.scss';


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

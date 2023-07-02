import Vue from 'vue';
import VueRouter from 'vue-router';

import commonRoutes from '../apps/common/routes';
import selectedAppData from '../apps/index.js';

Vue.use(VueRouter)

const routes = [
  ...commonRoutes,
  ...selectedAppData.routes
]

export const router = new VueRouter({
  mode: 'hash',
  routes,
  // base: process.env.BASE_URL
});

// for before each usage
let _store = null;
export const setStoreForRouter = store => _store = store

// router.beforeEach((to, from, next) => {
//   next();
// });

// export default router

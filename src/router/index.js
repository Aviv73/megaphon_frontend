import Vue from 'vue';
import VueRouter from 'vue-router';

import { commonRoutes } from '@/modules/common/routes';
import { releaseRoutes } from '@/modules/release/routes';
// import { settingsRoutes } from '@/modules/settings/routes';

Vue.use(VueRouter)

const routes = [
  ...commonRoutes,
  ...releaseRoutes,
  // ...settingsRoutes
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

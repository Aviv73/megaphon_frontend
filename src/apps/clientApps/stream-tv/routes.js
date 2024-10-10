// import rootCommonRoutes from '../../common/routes';

import Home from './views/streamTv_Home.vue';
import About from './views/streamTv_About.vue';
import CostumePage from '@/apps/common/modules/common/views/common_CostumePage.vue';

import ReleaseApp from './views/streamTv_ReleaseApp.vue';
import ReleasePage from '@/apps/common/modules/release/views/common_ReleasePage.vue';
import ReleaseDetails from './views/streamTv_ReleaseDetails.vue';

export default [
  // ...rootCommonRoutes,
  {
    path: '/',
    component: Home,
    name: 'HomePage'
  },
  {
    path: '/about',
    component: About,
    name: 'AboutPage'
  },
  {
    name: 'CostumePage',
    path: '/nav',
    component: CostumePage
  },
  {
    name: 'ReleaseApp',
    path: '/release',
    component: ReleaseApp,
    children: [
      {
        name: 'ReleasePage',
        path: '/',
        component: ReleasePage
      },
      {
        name: 'DirectReleaseDetails',
        path: '1/:id/:tabName?',
        component: ReleaseDetails,
        meta: {
          reportReleaseOpen: false,
          releaseIdParamName: 'id',
          noAuth: true
        }
      },
      {
        name: 'ReleaseDetails',
        path: ':id/:tabName?',
        component: ReleaseDetails,
        meta: {
          reportReleaseOpen: true,
          releaseIdParamName: 'id'
        }
      }
    ]
  }
]
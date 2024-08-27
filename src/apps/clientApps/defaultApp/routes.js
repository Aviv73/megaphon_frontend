// import rootCommonRoutes from '../../common/routes';

import Home from './views/default_Home.vue';
import About from './views/default_About.vue';
import CostumePage from '@/apps/common/modules/common/views/common_CostumePage.vue';

import ReleaseApp from './views/default_ReleaseApp.vue';
import ReleasePage from '@/apps/common/modules/release/views/common_ReleasePage.vue';
import ReleaseDetails from './views/default_ReleaseDetails.vue';

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
        name: 'ReleaseDetails',
        path: ':id',
        component: ReleaseDetails,
        meta: {
          reportReleaseOpen: true,
          releaseIdParamName: 'id'
        }
      }
    ]
  }
]
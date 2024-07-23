import Home from './views/cellcomTv_Home.vue';
import About from './views/cellcomTv_About.vue';
import CostumePage from '@/apps/common/modules/common/views/common_CostumePage.vue';

import ReleaseApp from './views/cellcomTv_ReleaseApp.vue';
import ReleasePage from '@/apps/common/modules/release/views/common_ReleasePage.vue';
import ReleaseDetails from './views/cellcomTv_ReleaseDetails.vue';

export default [
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
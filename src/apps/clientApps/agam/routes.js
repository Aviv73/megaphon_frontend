import Home from './views/agam_Home.vue';
import About from './views/agam_About.vue';

import ReleaseApp from './views/agam_ReleaseApp.vue';
import ReleasePage from './views/agam_ReleasePage.vue';
import ReleaseDetails from './views/agam_ReleaseDetails.vue';

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
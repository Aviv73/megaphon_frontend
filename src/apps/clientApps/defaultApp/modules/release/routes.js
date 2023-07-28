import ReleaseApp from './default_ReleaseApp';
import ReleasePage from './views/default_ReleasePage';
import ReleaseDetails from './views/default_ReleaseDetails';

export const releaseRoutes = [
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
        component: ReleaseDetails
      }
    ]
  }
]
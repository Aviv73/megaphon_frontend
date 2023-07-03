import ReleaseApp from './ReleaseApp';
import ReleasePage from './views/ReleasePage';
import ReleaseDetails from './views/ReleaseDetails';

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
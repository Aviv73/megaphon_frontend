import ReleaseApp from './agam_ReleaseApp';
import ReleasePage from './views/agam_ReleasePage';
import ReleaseDetails from './views/agam_ReleaseDetails';

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
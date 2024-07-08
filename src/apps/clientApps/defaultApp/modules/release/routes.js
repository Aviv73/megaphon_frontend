import ReleaseApp from './default_ReleaseApp';
import ReleasePage from '../../../../common/modules/release/views/common_ReleasePage';
import ReleaseDetails from './views/default_ReleaseDetails.vue';

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
        component: ReleaseDetails,
        meta: {
          reportReleaseOpen: true,
          releaseIdParamName: 'id'
        }
      }
    ]
  }
]
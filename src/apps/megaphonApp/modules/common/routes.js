import MainSidebarView from './views/MainSidebarView';
import ReleasePage from '../release/views/ReleasePage';
import ReleaseEdit from '../release/views/ReleaseEdit';
import ReleaseDistribution from '../release/views/ReleaseDistribution';
import ReleaseReport from '../release/views/ReleaseReport';
import ContactPage from '../contact/views/ContactPage';
import { contactRoutes } from '../contact/routes';
import { accountRoutes } from '../account/routes';
import { organizationRoutes } from '../organization/routes';

import AccountEditModal from '../account/cmps/AccountEditModal.vue';

export const commonRoutes = [
  {
    path: '/release/edit/:organizationId/:id?',
    component: ReleaseEdit,
    name: 'ReleaseEdit'
  },
  {
    path: '/release/distribute/:organizationId/:id',
    component: ReleaseDistribution,
    name: 'ReleaseDistribution'
  },
  {
    path: '/release/report/:organizationId/:id',
    component: ReleaseReport,
    name: 'ReleaseReport'
  },
  {
    path: '/',
    component: MainSidebarView,
    name: 'MainSidebarView',
    children: [
      {
        path: '/release/:organizationId',
        component: ReleasePage,
        name: 'ReleasePage',
        children: [
          {
            component: AccountEditModal,
            name: 'AccountEditModal',
            path: 'edit-accont/:id'
          }
        ]
      },
      // {
      //   path: '/contact/:organizationId',
      //   component: ContactPage,
      //   name: 'ContactPage'
      // }
      ...contactRoutes,
      ...accountRoutes,
      ...organizationRoutes
    ]
  },
]
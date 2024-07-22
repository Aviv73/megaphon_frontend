
import { commonRoutes } from './modules/common/routes';
import { releaseRoutes } from './modules/release/routes';
import { tagRoutes } from './modules/tag/routes';
import { companyRoutes } from './modules/company/routes';
import { authRoutes } from './modules/auth/routes';
// import { organizationRoutes } from './modules/organization/routes';
// import { accountRoutes } from './modules/account/routes';

import MainSidebarView from './modules/common/views/MainSidebarView';
import ReleasePage from './modules/release/views/ReleasePage';
import ReleaseEdit from './modules/release/views/ReleaseEdit';
import ReleaseDetails from './modules/release/views/ReleaseDetails';
import ReleaseDistribution from './modules/release/views/ReleaseDistribution';
import ReleaseReport from './modules/release/views/ReleaseReport';
import ContactReportPage from './modules/release/views/ContactReportPage';
// import ContactPage from './modules/contact/views/ContactPage';
import { contactRoutes } from './modules/contact/routes';
import { accountRoutes } from './modules/account/routes';
import { organizationRoutes } from './modules/organization/routes';

import AccountEditModal from './modules/account/cmps/AccountEditModal.vue';
import { settingsRoutes } from '../common/modules/settings/routes';

import FileViewer from '../common/modules/common/views/FileViewer.vue';


export default [
  ...commonRoutes,
  ...releaseRoutes,
  ...tagRoutes,
  ...companyRoutes,
  ...authRoutes,
  // ...organizationRoutes
  // ...accountRoutes,
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
    path: '/release/contact-report/:id?',
    component: ContactReportPage,
    name: 'ContactReportPage'
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
      {
        path: '/release/:organizationId/:id',
        component: ReleaseDetails,
        name: 'ReleaseDetails'
      },
      {
        path: '/file-viewer',
        component: FileViewer,
        name: 'FileViewer'
      },
      // {
      //   path: '/contact/:organizationId',
      //   component: ContactPage,
      //   name: 'ContactPage'
      // }
      ...contactRoutes,
      ...accountRoutes,
      ...organizationRoutes,
      // {
      //   name: 'SettingsPage',
      //   path: '/',
      //   component: SettingsPage
      // }
      ...settingsRoutes
    ]
  }
]
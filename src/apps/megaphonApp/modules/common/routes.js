import MainSidebarView from './views/MainSidebarView';
import ReleasePage from '../release/views/ReleasePage';
import ContactPage from '../contact/views/ContactPage';
import { contactRoutes } from '../contact/routes';
import { accountRoutes } from '../account/routes';

export const commonRoutes = [
  {
    path: '/',
    component: MainSidebarView,
    name: 'MainSidebarView',
    children: [
      {
        path: '/release/:organizationId',
        component: ReleasePage,
        name: 'ReleasePage'
      },
      // {
      //   path: '/contact/:organizationId',
      //   component: ContactPage,
      //   name: 'ContactPage'
      // }
      ...contactRoutes,
      ...accountRoutes
    ]
  }
]
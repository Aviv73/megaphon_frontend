import OrganizationApp from './OrganizationApp';
import OrganizationPage from './views/OrganizationPage';
import OrganizationDetails from './views/OrganizationDetails';
import OrganizationEdit from './views/OrganizationEdit';

export const organizationRoutes = [
  {
    name: 'OrganizationApp',
    path: '/organization',
    component: OrganizationApp,
    children: [
      {
        name: 'OrganizationPage',
        path: '/',
        component: OrganizationPage
      },
      {
        name: 'OrganizationEdit',
        path: 'edit/:id?',
        component: OrganizationEdit
      },
      {
        name: 'OrganizationDetails',
        path: ':id',
        component: OrganizationDetails
      }
    ]
  }
]
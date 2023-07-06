import AccountApp from './AccountApp';
import AccountPage from './views/AccountPage';
import AccountDetails from './views/AccountDetails';
import AccountEdit from './views/AccountEdit';

export const accountRoutes = [
  {
    name: 'AccountApp',
    path: '/account',
    component: AccountApp,
    children: [
      {
        name: 'AccountPage',
        path: '/',
        component: AccountPage
      },
      {
        name: 'AccountEdit',
        path: 'edit/:id?',
        component: AccountEdit
      },
      {
        name: 'AccountDetails',
        path: ':id',
        component: AccountDetails
      }
    ]
  }
]
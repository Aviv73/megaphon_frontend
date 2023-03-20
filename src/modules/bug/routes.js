import BugApp from './BugApp';
import BugPage from './views/BugPage';
import BugDetails from './views/BugDetails';
import BugEdit from './views/BugEdit';

export const bugRoutes = [
  {
    name: 'BugApp',
    path: '/bug',
    component: BugApp,
    children: [
      {
        name: 'BugPage',
        path: '/',
        component: BugPage
      },
      {
        name: 'BugEdit',
        path: 'edit/:id?',
        component: BugEdit
      },
      {
        name: 'BugDetails',
        path: ':id',
        component: BugDetails
      }
    ]
  }
]
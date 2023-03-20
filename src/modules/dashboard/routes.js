import DashboardApp from './DashboardApp';
import DashboardPage from './views/DashboardPage';

export const dashboardRoutes = [
  {
    name: 'DashboardApp',
    path: '/dashboard',
    component: DashboardApp,
    children: [
      {
        name: 'DashboardPage',
        path: ':organizationId?',
        component: DashboardPage
      }
    ]
  }
]
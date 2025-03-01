import StatsApp from './StatsApp';
import StatsPage from './views/StatsPage';

export const statsRoutes = [
  {
    path: '/stats/:organizationId',
    component: StatsApp,
    name: 'StatsApp',
    children: [
      {
        path: '/',
        component: StatsPage,
        name: 'StatsPage'
      }
    ]
  }
]
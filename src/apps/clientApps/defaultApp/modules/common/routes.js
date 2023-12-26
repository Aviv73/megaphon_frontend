import Home from './views/default_Home';
import About from './views/default_About';
import CostumePage from './views/default_CostumePage';

export const commonRoutes = [
  {
    path: '/',
    component: Home,
    name: 'HomePage'
  },
  {
    path: '/about',
    component: About,
    name: 'AboutPage'
  },
  {
    name: 'CostumePage',
    path: '/nav',
    component: CostumePage
  }
]
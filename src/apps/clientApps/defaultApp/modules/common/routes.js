import Home from './views/default_Home';
import About from './views/default_About';

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
  }
]
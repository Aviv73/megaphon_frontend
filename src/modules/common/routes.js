import Home from './views/Home';
import About from './views/About';
import SandBox from './views/SandBox';

import AdminPage from './views/AdminPage';
import AccountPage from '@/modules/account/views/AccountPage';
import BugPage from '@/modules/bug/views/BugPage';

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
    path: '/sand-box',
    component: SandBox,
    name: 'SandBox'
  },
  {
    path: '/admin',
    component: AdminPage,
    name: 'AdminPage',
    children: [
      {
        path: 'account',
        component: AccountPage,
        name: 'Admin_AccountPage'
      },
      {
        path: 'bug',
        component: BugPage,
        name: 'Admin_BugPage'
      },
    ]
  }
]
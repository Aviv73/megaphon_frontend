import AuthApp from './AuthApp';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';

export const authRoutes = [
  {
    name: 'AuthApp',
    path: '/example',
    component: AuthApp,
    children: [
      {
        name: 'LoginPage',
        path: '/login',
        component: LoginPage
      },
      {
        name: 'SignupPage',
        path: '/signup',
        component: SignupPage
      },
    ]
  }
]
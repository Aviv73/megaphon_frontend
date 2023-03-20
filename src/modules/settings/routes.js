import SettingsApp from './SettingsApp';
import SettingsPage from './views/SettingsPage';

export const settingsRoutes = [
  {
    name: 'SettingsApp',
    path: '/settings',
    component: SettingsApp,
    children: [
      {
        name: 'SettingsPage',
        path: '/',
        component: SettingsPage
      }
    ]
  }
]
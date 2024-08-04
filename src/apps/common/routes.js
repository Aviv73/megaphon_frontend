
import { commonRoutes } from './modules/common/routes';
import { authRoutes } from './modules/auth/routes';
// import { settingsRoutes } from './modules/settings/routes';

export default [
  ...commonRoutes,
  ...authRoutes
  // ...settingsRoutes
]
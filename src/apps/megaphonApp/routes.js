
import { commonRoutes } from './modules/common/routes';
import { releaseRoutes } from './modules/release/routes';
import { tagRoutes } from './modules/tag/routes';
import { companyRoutes } from './modules/company/routes';
import { authRoutes } from './modules/auth/routes';
// import { accountRoutes } from './modules/account/routes';

export default [
  ...commonRoutes,
  ...releaseRoutes,
  ...tagRoutes,
  ...companyRoutes,
  ...authRoutes,
  // ...accountRoutes
]
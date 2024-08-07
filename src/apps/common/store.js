import { commonStore } from './modules/common/store'
import { releaseStore } from './modules/release/store'
import { organizationStore } from './modules/organization/store'
// import { settingsStore } from './modules/settings/store'
import { authStore } from './modules/auth/store'

export default {
  // ...settingsStore,
  ...commonStore,
  ...releaseStore,
  ...organizationStore,
  ...authStore
}
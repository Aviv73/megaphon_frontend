import { commonStore } from './modules/common/store'
import { releaseStore } from './modules/release/store'
import { organizationStore } from './modules/organization/store'
import { settingsStore } from './modules/settings/store'

export default {
  ...commonStore,
  ...releaseStore,
  ...organizationStore,
  ...settingsStore
}
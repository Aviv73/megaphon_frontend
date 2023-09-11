import { companyStore } from './modules/company/store'
import { tagStore } from './modules/tag/store'
import { contactStore } from './modules/contact/store'
import { accountStore } from './modules/account/store'
import { authStore } from './modules/auth/store'
import { organizationStore } from './modules/organization/store'
import { releaseStore } from './modules/release/store'

export default {
  ...companyStore,
  ...tagStore,
  ...contactStore,
  ...accountStore,
  ...authStore,
  ...organizationStore,
  ...releaseStore
}
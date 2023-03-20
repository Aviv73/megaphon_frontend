import { commonLocales } from '@/modules/common/locales';
import { organizationLocales } from '@/modules/organization/locales';
import { postLocales } from '@/modules/post/locales';
import { commentLocales } from '@/modules/comment/locales';
import { activityLocales } from '@/modules/activity/locales';
import { accountLocales } from '@/modules/account/locales';
import { settingsLocales } from '@/modules/settings/locales';
import { authLocales } from '@/modules/auth/locales';
import { bugLocales } from '@/modules/bug/locales';
import { shoppingListLocales } from '@/modules/shoppingList/locales';
import { dashboardLocales } from '../../modules/dashboard/locales';

export default {
  en: {
    ...commonLocales.en,
    ...organizationLocales.en,
    ...postLocales.en,
    ...commentLocales.en,
    ...activityLocales.en,
    ...accountLocales.en,
    ...settingsLocales.en,
    ...authLocales.en,
    ...bugLocales.en,
    ...shoppingListLocales.en,
    ...dashboardLocales.en
  },
  he: {
    ...commonLocales.he,
    ...organizationLocales.he,
    ...postLocales.he,
    ...commentLocales.he,
    ...activityLocales.he,
    ...accountLocales.he,
    ...settingsLocales.he,
    ...authLocales.he,
    ...bugLocales.he,
    ...shoppingListLocales.he,
    ...dashboardLocales.he
  },
  heF: {
    ...commonLocales.heF,
    ...organizationLocales.heF,
    ...postLocales.heF,
    ...commentLocales.heF,
    ...activityLocales.heF,
    ...accountLocales.heF,
    ...settingsLocales.heF,
    ...authLocales.heF,
    ...bugLocales.heF,
    ...shoppingListLocales.heF,
    ...dashboardLocales.heF
  },
}
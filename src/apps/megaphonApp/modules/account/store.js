import { accountService } from './services/account.service';
// import { alertService } from '@/apps/common/modules/common/services/alert.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

// import { $t } from '@/plugins/i18n';

// const initState = () => ({
//   ...basicStoreService.initState()
// });

export const accountStore = basicStoreService.createSimpleCrudStore('account', undefined, undefined, undefined, accountService.getEmptyAccount);
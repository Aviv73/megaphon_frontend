import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';


export const selectItemStore = basicStoreService.createSimpleCrudStore(
  'selectItem'
);
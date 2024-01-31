import { companyService } from './company.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

export const companyStore = basicStoreService.createSimpleCrudStore('company', undefined, companyService);
import { companyService } from './company.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

const baseStore = basicStoreService.createSimpleCrudStore(undefined, companyService, 'company');

export const companyStore = { company: baseStore };
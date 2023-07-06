import { contactService } from './contact.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

const initState = () => ({
  ...basicStoreService.initState(),
  filterBy: {
    ...basicStoreService.initFilterBy(),
    pagination: {
      page: 0,
      limit: 15
    }
  }
});

const baseStore = basicStoreService.createSimpleCrudStore(initState, contactService, 'contact');

export const contactStore = { contact: baseStore };
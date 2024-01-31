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

export const contactStore = basicStoreService.createSimpleCrudStore('contact', initState, contactService);
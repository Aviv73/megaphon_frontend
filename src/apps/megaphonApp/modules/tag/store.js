import { tagService } from './tag.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

const baseStore = basicStoreService.createSimpleCrudStore(undefined, tagService);

export const tagStore = { tag: baseStore };
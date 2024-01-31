import { tagService } from './tag.service';
import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

export const tagStore = basicStoreService.createSimpleCrudStore('tag', undefined, tagService);
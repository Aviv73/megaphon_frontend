import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';

function getEmptyWatchLogItem(fileId, accountId, organizationId) {
  return {
    fileId: fileId || null,
    accountId: accountId || null,
    organizationId: organizationId || null,
    sections: [/*{
      id: String,
      start: TimeMS,
      end: TimeMS
    }*/],
    // totalWatchTime: 0,
    videoSecondsDuration: 0
  }
}

export const videoWatchLogStore = basicStoreService.createSimpleCrudStore('videoWatchLog', undefined, undefined, undefined, getEmptyWatchLogItem);
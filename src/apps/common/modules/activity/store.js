import { basicStoreService } from '@/apps/common/modules/common/services/basic-store.service';
import { httpService } from '@/apps/common/modules/common/services/http.service';


export const activityStore = basicStoreService.createSimpleCrudStore(
  'activity',
  undefined,
  {
    actions: {
      loadReport(context, { filterBy, organizationId }) {
        return httpService.get(`activity/report/${organizationId}`, filterBy);
      }
    }
  }
);
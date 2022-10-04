import { Injectable } from '@nestjs/common';
import { ActivityLog } from '@prisma/client';
import {
  ActionENUM,
  PriorityENUM,
} from '../../activity-log/dto/activity-log.dto';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CustomLogger } from '../../shared/custom-logger';

export const createActivityLogForAnnouncement: ActivityLog = {
  id: '0e9cdfab-cc6b-41b3-a3e5-6997203bfbdf',
  entityName: 'announcement',
  createdAt: new Date(),
  updatedAt: new Date(),
  action: ActionENUM.ADDED,
  userId: '2cf38670-0a8a-41e9-9018-e8b8a9b36486',
  priority: PriorityENUM.IMPORTANT,
  oldValue: '',
  newValue: '',
  entityId: 'f3666617-01ec-4f7f-8bd9-6d337268c30a',
  executedAt: new Date(),
};
@Injectable()
export class ActivityLogTestDataService {
  private readonly logger = new CustomLogger(ActivityLogTestDataService.name);
  constructor(private readonly prisma: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING ACTIVITY LOG TEST DATA');
    const findActivityLog = await this.prisma.activityLog.findUnique({
      where: {
        id: createActivityLogForAnnouncement.id,
      },
    });

    if (!findActivityLog) {
      await this.createActivityLog(createActivityLogForAnnouncement);
    }
  }

  private async createActivityLog(data: ActivityLog) {
    await this.prisma.activityLog.create({ data });
  }
}

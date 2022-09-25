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
  username: 'TEST_USER',
  priority: PriorityENUM.IMPORTANT,
  oldValue: '',
  newValue: '',
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

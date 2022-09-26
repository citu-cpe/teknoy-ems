import { Module } from '@nestjs/common';
import { ActivityLogGateway } from './activity-log.gateway';
import { AnnouncementCreateListenerService } from './activity-log.service';

@Module({
  providers: [AnnouncementCreateListenerService, ActivityLogGateway],
  exports: [ActivityLogGateway],
})
export class ActivityLogModule {}

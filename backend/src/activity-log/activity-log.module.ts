import { Module } from '@nestjs/common';
import { ActivityLogGateway } from './activity-log.gateway';
import { ActivityLogListenerService } from './activity-log.service';

@Module({
  providers: [ActivityLogListenerService, ActivityLogGateway],
  exports: [ActivityLogGateway],
})
export class ActivityLogModule {}

import { Module } from '@nestjs/common';
import { NotificationGateway } from './notication.gateway';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
  controllers: [NotificationController],
})
export class NotificationModule {}

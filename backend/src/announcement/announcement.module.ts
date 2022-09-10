import { Module } from '@nestjs/common';
import { AnnouncementController } from './announcement.controller';
import { AnnouncementServices } from './announcement.service';

@Module({
  providers: [AnnouncementServices],
  exports: [AnnouncementServices],
  controllers: [AnnouncementController],
})
export class AnnouncementModule {}

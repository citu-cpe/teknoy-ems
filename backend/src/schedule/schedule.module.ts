import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}

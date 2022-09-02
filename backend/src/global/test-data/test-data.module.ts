import { Module } from '@nestjs/common';
import { ScheduleTestDataService } from './schedule-test-data.service';
import { TestDataService } from './test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Module({
  providers: [TestDataService, UserTestDataService, ScheduleTestDataService],
  exports: [TestDataService],
})
export class TestDataModule {}

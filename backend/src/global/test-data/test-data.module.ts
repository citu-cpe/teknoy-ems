import { Module } from '@nestjs/common';
import { EquipmentTestDataService } from './equipment-test-data.service';
import { OrganizerTestDataService } from './organizer-test-data.service';
import { ScheduleTestDataService } from './schedule-test-data.service';
import { TestDataService } from './test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Module({
  providers: [
    TestDataService,
    UserTestDataService,
    ScheduleTestDataService,
    OrganizerTestDataService,
    EquipmentTestDataService,
  ],
  exports: [TestDataService],
})
export class TestDataModule {}

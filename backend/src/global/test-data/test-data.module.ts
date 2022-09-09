import { Module } from '@nestjs/common';
import { AnnouncementTestDataService } from './announcement-test-data.service';
import { EquipmentTestDataService } from './equipment-test-data.service';
import { OrganizerTestDataService } from './organizer-test-data.service';
import { ScheduleTestDataService } from './schedule-test-data.service';
import { TestDataService } from './test-data.service';
import { UserTestDataService } from './user-test-data.service';
import { VenueTestDataService } from './venue-test-data.service';

@Module({
  providers: [
    TestDataService,
    UserTestDataService,
    ScheduleTestDataService,
    OrganizerTestDataService,
    EquipmentTestDataService,
    VenueTestDataService,
    AnnouncementTestDataService,
  ],
  exports: [TestDataService],
})
export class TestDataModule {}

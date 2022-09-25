import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveProfilesService } from '../active-profiles/active-profiles.service';
import { ActivityLogTestDataService } from './activity-log-test-data.service';
import { AnnouncementTestDataService } from './announcement-test-data.service';
import { EquipmentTestDataService } from './equipment-test-data.service';
import { EventTestDataService } from './event-test-data.service';
import { OrganizerTestDataService } from './organizer-test-data.service';
import { ScheduleTestDataService } from './schedule-test-data.service';
import { UserTestDataService } from './user-test-data.service';
import { VenueTestDataService } from './venue-test-data.service';

@Injectable()
export class TestDataService implements OnModuleInit {
  constructor(
    private readonly userTestDataService: UserTestDataService,
    private readonly scheduleTestDataService: ScheduleTestDataService,
    private readonly activeProfilesService: ActiveProfilesService,
    private readonly organizerTestDataservice: OrganizerTestDataService,
    private readonly equipmentTestDataService: EquipmentTestDataService,
    private readonly venueTestDataService: VenueTestDataService,
    private readonly announcementTestDataService: AnnouncementTestDataService,
    private readonly eventTestDataService: EventTestDataService,
    private readonly activityLogTestDataService: ActivityLogTestDataService
  ) {}

  public async onModuleInit() {
    if (
      this.activeProfilesService.isTestDataProfileActive() ||
      this.activeProfilesService.isTestProfileActive()
    ) {
      await this.generateTestData();
    }
  }

  public async generateTestData() {
    await this.userTestDataService.generateTestData();
    await this.scheduleTestDataService.generateTestData();
    await this.organizerTestDataservice.generateTestData();
    await this.equipmentTestDataService.generateTestData();
    await this.venueTestDataService.generateTestData();
    await this.announcementTestDataService.generateTestData();
    await this.eventTestDataService.generateTestData();
    await this.activityLogTestDataService.generateTestData();
  }
}

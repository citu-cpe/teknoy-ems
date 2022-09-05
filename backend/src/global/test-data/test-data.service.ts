import { Injectable, OnModuleInit } from '@nestjs/common';
import { ActiveProfilesService } from '../active-profiles/active-profiles.service';
import { EquipmentTestDataService } from './equipment-test-data.service';
import { OrganizerTestDataService } from './organizer-test-data.service';
import { ScheduleTestDataService } from './schedule-test-data.service';
import { UserTestDataService } from './user-test-data.service';

@Injectable()
export class TestDataService implements OnModuleInit {
  constructor(
    private readonly userTestDataService: UserTestDataService,
    private readonly scheduleTestDataService: ScheduleTestDataService,
    private readonly activeProfilesService: ActiveProfilesService,
    private readonly organizerTestDataservice: OrganizerTestDataService,
    private readonly equipmentTestDataService: EquipmentTestDataService
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
  }
}

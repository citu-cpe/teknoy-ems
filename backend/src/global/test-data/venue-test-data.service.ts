import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CustomLogger } from '../../shared/custom-logger';
import { Schedule, Venues } from '@prisma/client';
import { AvailabilityEnum } from '../../schedule/dto/schedule.dto';
import { TEST_DATA_PREFIX } from '../../shared/constants/test-data-prefix';

export const venueTestCC: Venues = {
  id: '6ee07e9c-daa6-4d13-a96a-91a64d380a2e',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: TEST_DATA_PREFIX + 'Covered Court',
  notes: 'this is a test for covered court',
};

export const venueTestGYM: Venues = {
  id: '9c519856-a674-4ae4-9cc3-92223fb09422',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: TEST_DATA_PREFIX + 'GYM',
  notes: 'this is a test for GYM',
};

export const addSchedToVenueCC: Schedule = {
  id: '234526c9-5433-45ce-9797-d1b0358fb26b',
  createdAt: new Date(),
  updatedAt: new Date(),
  availability: AvailabilityEnum.AVAILABLE,
  startTime: new Date('2022-9-2 2:00:00 PM'),
  endTime: new Date('2022-9-2 5:00:00 PM'),
  equipmentId: null,
  venuesId: null,
};

export const addSchedToVenueGYM: Schedule = {
  id: 'bae4c239-2e99-4364-834e-aa3cc26b5b07',
  createdAt: new Date(),
  updatedAt: new Date(),
  availability: AvailabilityEnum.AVAILABLE,
  startTime: new Date('2022-9-2 2:00:00 PM'),
  endTime: new Date('2022-9-2 5:00:00 PM'),
  equipmentId: null,
  venuesId: null,
};

@Injectable()
export class VenueTestDataService {
  private readonly logger = new CustomLogger(VenueTestDataService.name);
  constructor(private readonly prisma: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING VENUE TEST DATA');

    const findDepartmentOrganizer = await this.prisma.venues.findUnique({
      where: {
        id: venueTestCC.id,
      },
    });

    const findOrganizationOrganizer = await this.prisma.venues.findUnique({
      where: {
        id: venueTestGYM.id,
      },
    });

    if (!findDepartmentOrganizer) {
      await this.createVenue(venueTestCC);
    }

    if (!findOrganizationOrganizer) {
      await this.createVenue(venueTestGYM);
    }

    const addSchedCC = await this.prisma.schedule.findUnique({
      where: {
        id: addSchedToVenueCC.id,
      },
    });

    if (!addSchedCC) {
      await this.createSchedule(addSchedToVenueCC, venueTestCC);
    }

    const addSchedGYM = await this.prisma.schedule.findUnique({
      where: {
        id: addSchedToVenueGYM.id,
      },
    });

    if (!addSchedGYM) {
      await this.createSchedule(addSchedToVenueGYM, venueTestGYM);
    }
  }

  private async createVenue(data: Venues) {
    await this.prisma.venues.create({ data });
  }

  private async createSchedule(data: Schedule, venue: Venues) {
    const schedule = await this.prisma.schedule.create({ data });

    const updatedVenue = await this.prisma.venues.update({
      where: {
        id: venue.id,
      },
      data: {
        schedules: {
          connect: {
            id: schedule.id,
          },
        },
      },
    });

    return updatedVenue;
  }
}

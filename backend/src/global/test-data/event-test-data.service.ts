import { Injectable } from '@nestjs/common';
import { CustomLogger } from '../../shared/custom-logger';
import { PrismaService } from '../prisma/prisma.service';
import { Event, EventType, Status, ViewAccess } from '@prisma/client';
import { testOrganizerDepartment } from './organizer-test-data.service';
import { testAdmin } from './user-test-data.service';
import { addEquipmentWithoutSched } from './equipment-test-data.service';
import { venueTestCC, venueTestGYM } from './venue-test-data.service';
import { TEST_DATA_PREFIX } from '../../shared/constants/test-data-prefix';

export const testEvent: Event = {
  id: '64415bad-632f-4f13-8946-4bffb0345615',
  createdAt: new Date(),
  updatedAt: new Date(),
  title: TEST_DATA_PREFIX + 'First Event',
  description: 'Welcome to the First Event',
  status: Status.PENDING,
  startTime: new Date('2022-09-09 02:00:00 PM'),
  endTime: new Date('2022-09-09 05:00:00 PM'),
  contactPerson: 'Product Owner Ra0l',
  contactNumber: '999-888-777',
  approvedBy: 'Backend Lead Patrek',
  viewAccess: ViewAccess.PUBLIC,
  type: EventType.ACADEMIC,
  additionalNotes: `Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur`,
  organizerId: testOrganizerDepartment.id,
  encodedById: testAdmin.id,
};

@Injectable()
export class EventTestDataService {
  private readonly logger = new CustomLogger(EventTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING EVENT TEST DATA');
    const existingEvent = await this.prismaService.event.findUnique({
      where: { id: testEvent.id },
    });

    if (!existingEvent) {
      await this.createEvent(testEvent);
    }
  }

  private async createEvent(event: Event) {
    await this.prismaService.event.create({
      data: {
        ...event,
        equipments: {
          create: [
            {
              equipmentId: addEquipmentWithoutSched.id,
            },
          ],
        },
        venues: {
          create: [
            {
              venuesId: venueTestCC.id,
            },
            {
              venuesId: venueTestGYM.id,
            },
          ],
        },
      },
    });
  }
}

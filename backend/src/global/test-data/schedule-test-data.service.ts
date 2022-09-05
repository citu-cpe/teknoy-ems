import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CustomLogger } from '../../shared/custom-logger';
import { Schedule, Availability } from '@prisma/client';

export const availableSchedule: Schedule = {
  id: '9a52e495-a1ec-49e0-acb4-2613a0c9e92b',
  createdAt: new Date(),
  updatedAt: new Date(),
  availability: Availability.AVAILABLE,
  startTime: new Date('2022-9-2 2:00:00 PM'),
  endTime: new Date('2022-9-2 5:00:00 PM'),
  equipmentId: null,
};

export const unavailableSchedule: Schedule = {
  id: '7a94e74a-732a-4c14-84ff-111d279100b3',
  createdAt: new Date(),
  updatedAt: new Date(),
  availability: Availability.UNAVAILABLE,
  startTime: new Date('2022-9-2 2:00:00 PM'),
  endTime: new Date('2022-9-2 5:00:00 PM'),
  equipmentId: null,
};

@Injectable()
export class ScheduleTestDataService {
  private readonly logger = new CustomLogger(ScheduleTestDataService.name);

  constructor(private readonly prismaService: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING SCHEDULE TEST DATA');

    const foundAvailableSchedule = await this.prismaService.schedule.findUnique(
      {
        where: { id: availableSchedule.id },
      }
    );
    const foundUnavailableSchedule =
      await this.prismaService.schedule.findUnique({
        where: { id: unavailableSchedule.id },
      });

    if (!foundAvailableSchedule) {
      this.logger.log('GENERATING AVAILABLE SCHEDULE');
      await this.createSchedule(availableSchedule);
    }
    if (!foundUnavailableSchedule) {
      this.logger.log('GENERATING UNAVAILABLE SCHEDULE');
      await this.createSchedule(unavailableSchedule);
    }

    this.logger.log('DONE GENERATING SCHEDULE TEST DATA');
  }

  private async createSchedule(schedule: Schedule) {
    await this.prismaService.schedule.create({ data: schedule });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../global/prisma/prisma.service';
import { CustomLogger } from '../../shared/custom-logger';
import { Equipment, Schedule } from '@prisma/client';
import { AvailabilityEnum } from '../../schedule/dto/schedule.dto';
import { TEST_DATA_PREFIX } from '../../shared/constants/test-data-prefix';
import { EquipmentTypeEnum } from '../../equipment/dto/equipment.dto';

export const addEquipmentWithoutSched: Equipment = {
  id: '3e8e27e1-b023-40a6-a367-52ab65937d35',
  createdAt: new Date(),
  updatedAt: new Date(),
  name: TEST_DATA_PREFIX + 'SONY CAM 1',
  brand: 'SONY',
  type: EquipmentTypeEnum.PHOTO_AND_VIDEO_DOCUMENTATION,
  serial: '123456789',
  notes: 'This is a test',
  archived: false,
};

export const addSchedToEquipment: Schedule = {
  id: '77155b33-6cae-4a6a-8c22-707c6e61d1b2',
  createdAt: new Date(),
  updatedAt: new Date(),
  availability: AvailabilityEnum.UNAVAILABLE,
  startTime: new Date('2022-9-2 2:00:00 PM'),
  endTime: new Date('2022-9-2 5:00:00 PM'),
  equipmentId: null,
  venuesId: null,
};
@Injectable()
export class EquipmentTestDataService {
  private readonly logger = new CustomLogger(EquipmentTestDataService.name);
  constructor(private readonly prisma: PrismaService) {}

  public async generateTestData() {
    this.logger.log('GENERATING EQUIPMENT TEST DATA');
    const findEquipment = await this.prisma.equipment.findUnique({
      where: {
        id: addEquipmentWithoutSched.id,
      },
    });
    if (!findEquipment) {
      await this.createEquipment(addEquipmentWithoutSched);
    }
    const addSched = await this.prisma.schedule.findUnique({
      where: {
        id: addSchedToEquipment.id,
      },
    });
    if (!addSched) {
      await this.createSchedule(addSchedToEquipment);
    }
  }

  private async createEquipment(data: Equipment) {
    await this.prisma.equipment.create({ data });
  }
  private async createSchedule(data: Schedule) {
    const schedule = await this.prisma.schedule.create({ data });
    const equipment = await this.prisma.equipment.update({
      where: {
        id: addEquipmentWithoutSched.id,
      },
      data: {
        schedules: {
          connect: {
            id: schedule.id,
          },
        },
      },
    });
    return equipment;
  }
}

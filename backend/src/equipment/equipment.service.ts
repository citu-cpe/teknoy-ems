import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Equipment, Schedule, User } from '@prisma/client';
import { AvailabilityEnum, ScheduleDTO } from '../schedule/dto/schedule.dto';
import { PrismaService } from '../global/prisma/prisma.service';
import { EquipmentDTO, EquipmentTypeEnum } from './dto/equipment.dto';
import { ScheduleService } from '../schedule/schedule.service';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { SortedEquipmentsDTO } from '../event/dto/sorted-equipments.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionENUM, PriorityENUM } from '../activity-log/dto/activity-log.dto';

export const EQUIPMENT_SET_POSTFIX = 'Equipment Set';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async addEquipment(
    user: User,
    data: EquipmentDTO
  ): Promise<EquipmentDTO> {
    try {
      const equipment = await this.prisma.equipment.create({
        data,
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'equipment',
        action: ActionENUM.ADDED,
        userId: user.id,
        priority: PriorityENUM.IMPORTANT,
        newValue: JSON.stringify(equipment),
        entityId: equipment.id,
      });
      return EquipmentService.convertToDTO(equipment);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        if (error.meta.target[0] === 'name') {
          throw new BadRequestException(
            'Equipment with that name already exists!'
          );
        }
      }
      throw new BadRequestException();
    }
  }

  public async addScheduletoEquipment(
    id: string,
    data: ScheduleDTO
  ): Promise<EquipmentDTO> {
    const schedule = await this.prisma.schedule.create({
      data,
    });
    const equipment = await this.prisma.equipment.update({
      where: {
        id,
      },
      data: {
        schedules: {
          connect: {
            id: schedule.id,
          },
        },
      },
    });
    return EquipmentService.convertToDTO(equipment);
  }

  public async getAllEquipments(): Promise<EquipmentDTO[]> {
    try {
      const getAll = await this.prisma.equipment.findMany({
        include: {
          schedules: true,
        },
      });
      return getAll.map((equipment) =>
        EquipmentService.convertToDTO(equipment)
      );
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async getEquipmenyById(id: string): Promise<EquipmentDTO> {
    try {
      const equipment = await this.prisma.equipment.findUniqueOrThrow({
        where: {
          id,
        },
        include: {
          schedules: true,
        },
      });
      return EquipmentService.convertToDTO(equipment);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async deleteEquipment(user: User, id: string): Promise<EquipmentDTO> {
    try {
      const equipment = await this.prisma.equipment.delete({
        where: {
          id,
        },
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'equipment',
        action: ActionENUM.DELETED,
        userId: user.id,
        priority: PriorityENUM.IMPORTANT,
        newValue: JSON.stringify(equipment),
        entityId: equipment.id,
      });
      return EquipmentService.convertToDTO(equipment);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateEquipment(
    user: User,
    id: string,
    data: EquipmentDTO
  ): Promise<EquipmentDTO> {
    try {
      const oldValue = await this.prisma.equipment.findUnique({
        where: {
          id,
        },
      });
      const equipment = await this.prisma.equipment.update({
        where: {
          id,
        },
        data,
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'equipment',
        entityId: equipment.id,
        action: ActionENUM.EDITED,
        userId: user.id,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(equipment),
        priority: PriorityENUM.IMPORTANT,
      });
      return EquipmentService.convertToDTO(equipment);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        if (error.meta.target[0] === 'name') {
          throw new BadRequestException(
            'Equipment with that name already exists!'
          );
        }
      }

      throw new NotFoundException();
    }
  }

  public async getSortedEquipments(
    startTime: Date,
    endTime: Date
  ): Promise<SortedEquipmentsDTO> {
    const unavailableEquipments = await this.prisma.equipment.findMany({
      where: {
        schedules: {
          some: {
            AND: {
              startTime: { lte: endTime },
              endTime: { gte: startTime },
              availability: AvailabilityEnum.UNAVAILABLE,
            },
          },
        },
      },
      include: { schedules: true },
    });

    const unavailableEquipmentsDTO = unavailableEquipments.map((u) =>
      EquipmentService.convertToDTO(u)
    );

    const availableEquipments = await this.prisma.equipment.findMany({
      where: {
        schedules: {
          none: {
            OR: {
              AND: { startTime: { lte: endTime }, endTime: { gte: startTime } },
              availability: AvailabilityEnum.UNAVAILABLE,
            },
          },
        },
      },
      include: { schedules: true },
    });

    const availableEquipmentsDTO = availableEquipments.map((a) =>
      EquipmentService.convertToDTO(a)
    );

    return {
      availableEquipments: availableEquipmentsDTO,
      unavailableEquipments: unavailableEquipmentsDTO,
    };
  }

  public static convertToDTO(
    equipment: Equipment & { schedules?: Schedule[] }
  ): EquipmentDTO {
    const equipmentDTO = new EquipmentDTO();
    equipmentDTO.brand = equipment.brand;
    equipmentDTO.id = equipment.id;
    equipmentDTO.createdAt = equipment.createdAt;
    equipmentDTO.updatedAt = equipment.updatedAt;
    equipmentDTO.name = equipment.name;
    equipmentDTO.notes = equipment.notes;
    equipmentDTO.type = equipment.type.toString() as EquipmentTypeEnum;
    equipmentDTO.serial = equipment.serial;

    if (equipment.schedules) {
      equipmentDTO.schedules = equipment.schedules.map((schedule) =>
        ScheduleService.convertToDTO(schedule)
      );
    }
    return equipmentDTO;
  }
}

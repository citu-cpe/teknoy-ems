import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Equipment, Schedule } from '@prisma/client';
import { ScheduleDTO } from '../schedule/dto/schedule.dto';
import { PrismaService } from '../global/prisma/prisma.service';
import { EquipmentDTO } from './dto/equipment.dto';
import { ScheduleService } from '../schedule/schedule.service';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { SortedEquipmentsDTO } from '../event/dto/sorted-equipments.dto';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

  public async addEquipment(data: EquipmentDTO): Promise<EquipmentDTO> {
    try {
      const equipment = await this.prisma.equipment.create({
        data,
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
    return equipment;
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

  public async deleteEquipment(id: string): Promise<EquipmentDTO> {
    try {
      const equipment = await this.prisma.equipment.delete({
        where: {
          id,
        },
      });
      return EquipmentService.convertToDTO(equipment);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateEquipment(
    id: string,
    data: EquipmentDTO
  ): Promise<EquipmentDTO> {
    try {
      const equipment = await this.prisma.equipment.update({
        where: {
          id,
        },
        data,
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
            AND: { startTime: { lte: endTime }, endTime: { gte: startTime } },
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
            AND: { startTime: { lte: endTime }, endTime: { gte: startTime } },
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
    equipmentDTO.type = equipment.type;
    equipmentDTO.serial = equipment.serial;

    if (equipment.schedules) {
      equipmentDTO.schedules = equipment.schedules.map((schedule) =>
        ScheduleService.convertToDTO(schedule)
      );
    }
    return equipmentDTO;
  }
}

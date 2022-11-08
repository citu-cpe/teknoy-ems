import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Schedule, User, Venues } from '@prisma/client';
import { ScheduleService } from '../schedule/schedule.service';
import { PrismaService } from '../global/prisma/prisma.service';
import { VenueDTO } from './dto/venue.dto';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { SortedVenuesDTO } from '../event/dto/sorted-venues.dto';
import { AvailabilityEnum, ScheduleDTO } from '../schedule/dto/schedule.dto';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionENUM, PriorityENUM } from '../activity-log/dto/activity-log.dto';
import {
  EquipmentDTO,
  EquipmentTypeEnum,
} from '../equipment/dto/equipment.dto';
import { EQUIPMENT_SET_POSTFIX } from '../equipment/equipment.service';

@Injectable()
export class VenueService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async createVenue(user: User, data: VenueDTO): Promise<VenueDTO> {
    try {
      const venue = await this.prisma.venues.create({
        data,
      });

      const equipmentDTO: EquipmentDTO = {
        name: `${data.name} ${EQUIPMENT_SET_POSTFIX}`,
        type: EquipmentTypeEnum.OTHERS,
      };

      await this.prisma.equipment.create({ data: equipmentDTO });

      this.eventEmitter.emit('create.logs', {
        entityName: 'venue',
        action: ActionENUM.ADDED,
        userId: user.id,
        newValue: JSON.stringify(venue),
        entityId: venue.id,
        priority: PriorityENUM.IMPORTANT,
      });

      return VenueService.convertToDTO(venue);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        if (error.meta.target[0] === 'name') {
          throw new BadRequestException('Venue with that name already exists!');
        }
      }
      throw new BadRequestException();
    }
  }
  public async addScheduletoVenue(
    id: string,
    data: ScheduleDTO
  ): Promise<VenueDTO> {
    const schedule = await this.prisma.schedule.create({
      data,
    });
    const equipment = await this.prisma.venues.update({
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

  public async getAllVenue(): Promise<VenueDTO[]> {
    try {
      const venues = await this.prisma.venues.findMany({
        include: {
          schedules: true,
        },
      });
      return venues.map((venue) => VenueService.convertToDTO(venue));
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async getVenueById(id: string): Promise<VenueDTO> {
    try {
      const venue = await this.prisma.venues.findUniqueOrThrow({
        where: {
          id,
        },
        include: { schedules: true },
      });
      return VenueService.convertToDTO(venue);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async deleteVenue(user: User, id: string): Promise<VenueDTO> {
    try {
      const venue = await this.prisma.venues.delete({
        where: {
          id,
        },
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'venue',
        action: ActionENUM.DELETED,
        userId: user.id,
        newValue: JSON.stringify(venue),
        entityId: venue.id,
        priority: PriorityENUM.IMPORTANT,
      });
      return VenueService.convertToDTO(venue);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateVenue(
    user: User,
    id: string,
    data: VenueDTO
  ): Promise<VenueDTO> {
    try {
      const oldValue = await this.prisma.venues.findUnique({
        where: {
          id,
        },
      });

      const venue = await this.prisma.venues.update({
        where: {
          id,
        },
        data,
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'venue',
        action: ActionENUM.EDITED,
        userId: user.id,
        entityId: venue.id,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(venue),
        priority: PriorityENUM.IMPORTANT,
      });
      return VenueService.convertToDTO(venue);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        if (error.meta.target[0] === 'name') {
          throw new BadRequestException('Venue with that name already exists!');
        }
      }
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async getSortedVenues(
    startTime: Date,
    endTime: Date
  ): Promise<SortedVenuesDTO> {
    const unavailableVenues = await this.prisma.venues.findMany({
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

    const unavailableVenuesDTO = unavailableVenues.map((u) =>
      VenueService.convertToDTO(u)
    );

    const availableVenues = await this.prisma.venues.findMany({
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

    const availableVenuesDTO = availableVenues.map((a) =>
      VenueService.convertToDTO(a)
    );

    return {
      availableVenues: availableVenuesDTO,
      unavailableVenues: unavailableVenuesDTO,
    };
  }

  public static convertToDTO(
    venue: Venues & { schedules?: Schedule[] }
  ): VenueDTO {
    const venueDTO = new VenueDTO();
    venueDTO.id = venue.id;
    venueDTO.createdAt = venue.createdAt;
    venueDTO.updatedAt = venue.updatedAt;
    venueDTO.name = venue.name;
    venueDTO.notes = venue.notes;
    if (venue.schedules) {
      venueDTO.schedule = venue.schedules.map((schedule) =>
        ScheduleService.convertToDTO(schedule)
      );
    }
    return venueDTO;
  }
}

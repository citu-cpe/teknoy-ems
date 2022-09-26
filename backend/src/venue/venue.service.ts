import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Schedule, Venues } from '@prisma/client';
import { ScheduleService } from '../schedule/schedule.service';
import { PrismaService } from '../global/prisma/prisma.service';
import { VenueDTO } from './dto/venue.dto';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { SortedVenuesDTO } from '../event/dto/sorted-venues.dto';
import { ScheduleDTO } from '../schedule/dto/schedule.dto';
import { PostgresErrorCode } from '../shared/constants/postgress-error-codes.enum';

@Injectable()
export class VenueService {
  constructor(private readonly prisma: PrismaService) {}

  public async createVenue(data: VenueDTO): Promise<VenueDTO> {
    try {
      const venue = await this.prisma.venues.create({
        data,
      });
      return venue;
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

  public async deleteVenue(id: string): Promise<VenueDTO> {
    try {
      const venue = await this.prisma.venues.delete({
        where: {
          id,
        },
      });
      return VenueService.convertToDTO(venue);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateVenue(id: string, data: VenueDTO): Promise<VenueDTO> {
    try {
      const venue = await this.prisma.venues.update({
        where: {
          id,
        },
        data,
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
            AND: { startTime: { lte: endTime }, endTime: { gte: startTime } },
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
            AND: { startTime: { lte: endTime }, endTime: { gte: startTime } },
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

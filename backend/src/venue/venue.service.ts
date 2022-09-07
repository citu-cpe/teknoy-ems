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
      throw new BadRequestException();
    }
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
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }
  public static convertToDTO(
    venue: Venues & { schedules?: Schedule[] }
  ): VenueDTO {
    const venueDTO = new VenueDTO();
    venueDTO.id = venue.id;
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

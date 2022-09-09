import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Announcement } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from '../global/prisma/prisma.service';
import { AnnouncementDTO, ViewAccessENUM } from './dto/announcement.dto';

@Injectable()
export class AnnouncementServices {
  constructor(private readonly prisma: PrismaService) {}

  public async getAllAnnouncements(): Promise<AnnouncementDTO[]> {
    const result = await this.prisma.announcement.findMany({});
    return result.map((announcement) =>
      AnnouncementServices.convertToDTO(announcement)
    );
  }
  public async getAnnouncementById(id: string): Promise<AnnouncementDTO> {
    try {
      const result = await this.prisma.announcement.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return AnnouncementServices.convertToDTO(result);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }
  public async createAnnouncement(
    data: AnnouncementDTO
  ): Promise<AnnouncementDTO> {
    try {
      const announcement = await this.prisma.announcement.create({
        data,
      });
      return AnnouncementServices.convertToDTO(announcement);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async updateAnnouncement(
    id: string,
    data: AnnouncementDTO
  ): Promise<AnnouncementDTO> {
    try {
      const announcement = await this.prisma.announcement.update({
        where: {
          id,
        },
        data,
      });
      return AnnouncementServices.convertToDTO(announcement);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }
  public async deleteAnnouncement(id: string): Promise<AnnouncementDTO> {
    try {
      const announcement = await this.prisma.announcement.delete({
        where: {
          id,
        },
      });
      return AnnouncementServices.convertToDTO(announcement);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public static convertToDTO(announcement: Announcement): AnnouncementDTO {
    const announcementDTO = new AnnouncementDTO();
    announcementDTO.id = announcement.id;
    announcementDTO.title = announcement.title;
    announcementDTO.subtitle = announcement.subtitle;
    announcementDTO.content = announcement.content;
    announcementDTO.tags = announcement.tags;
    announcementDTO.viewAccess =
      announcement.viewAccess.toString() as ViewAccessENUM;
    return announcementDTO;
  }
}

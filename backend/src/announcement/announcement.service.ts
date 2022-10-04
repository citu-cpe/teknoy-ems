import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Announcement, User } from '@prisma/client';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { PrismaService } from '../global/prisma/prisma.service';
import { AnnouncementDTO, ViewAccessENUM } from './dto/announcement.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionENUM, PriorityENUM } from '../activity-log/dto/activity-log.dto';

@Injectable()
export class AnnouncementServices {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

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
    user: User,
    data: AnnouncementDTO
  ): Promise<AnnouncementDTO> {
    try {
      const announcement = await this.prisma.announcement.create({
        data,
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'announcement',
        entityId: announcement.id,
        userId: user.id,
        action: ActionENUM.ADDED,
        newValue: JSON.stringify(data),
        priority: PriorityENUM.IMPORTANT,
      });

      return AnnouncementServices.convertToDTO(announcement);
    } catch (error) {
      throw new BadRequestException();
    }
  }
  public async updateAnnouncement(
    user: User,
    id: string,
    data: AnnouncementDTO
  ): Promise<AnnouncementDTO> {
    try {
      const oldValue = await this.prisma.announcement.findUnique({
        where: {
          id,
        },
      });
      const announcement = await this.prisma.announcement.update({
        where: {
          id,
        },
        data,
      });

      this.eventEmitter.emit('create.logs', {
        entityName: 'announcement',
        action: ActionENUM.EDITED,
        userId: user.id,
        entityId: announcement.id,
        priority: PriorityENUM.IMPORTANT,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(data),
      });

      return AnnouncementServices.convertToDTO(announcement);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async deleteAnnouncement(
    user: User,
    id: string
  ): Promise<AnnouncementDTO> {
    try {
      const announcement = await this.prisma.announcement.delete({
        where: {
          id,
        },
      });

      this.eventEmitter.emit('create.logs', {
        entityId: announcement.id,
        userId: user.id,
        entityName: 'announcement',
        action: ActionENUM.DELETED,
        newValue: JSON.stringify(announcement),
        priority: PriorityENUM.IMPORTANT,
      });
      return AnnouncementServices.convertToDTO(announcement);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public static convertToDTO(announcement: Announcement): AnnouncementDTO {
    const announcementDTO = new AnnouncementDTO();
    announcementDTO.id = announcement.id;
    announcementDTO.createdAt = announcement.createdAt;
    announcementDTO.updatedAt = announcement.updatedAt;
    announcementDTO.title = announcement.title;
    announcementDTO.subtitle = announcement.subtitle;
    announcementDTO.content = announcement.content;
    announcementDTO.tags = announcement.tags;
    announcementDTO.viewAccess =
      announcement.viewAccess.toString() as ViewAccessENUM;
    return announcementDTO;
  }
}

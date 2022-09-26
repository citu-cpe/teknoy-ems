import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Organizer, User } from '@prisma/client';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { ActionENUM, PriorityENUM } from '../activity-log/dto/activity-log.dto';
import { PrismaService } from '../global/prisma/prisma.service';
import { OrganizerDTO, TypeEnum } from './dto/organizer.dto';
@Injectable()
export class OrganizerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async createNewOrganizer(
    user: User,
    organizerDTO: OrganizerDTO
  ): Promise<any> {
    const result = await this.prisma.organizer.findMany({
      where: {
        name: {
          equals: organizerDTO.name,
          mode: 'insensitive',
        },
      },
    });
    if (result.length > 0) {
      throw new BadRequestException('Organizer already exists');
    } else {
      const organizer = await this.prisma.organizer.create({
        data: organizerDTO,
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'organizer',
        action: ActionENUM.ADDED,
        username: user.name,
        priority: PriorityENUM.IMPORTANT,
      });
      return OrganizerService.convertToDTO(organizer);
    }
  }

  public async getAllOrganizer(): Promise<OrganizerDTO[]> {
    const allOrganizers = await this.prisma.organizer.findMany();
    return allOrganizers.map((organizer) =>
      OrganizerService.convertToDTO(organizer)
    );
  }

  public async getOrganizerById(id: string): Promise<OrganizerDTO> {
    try {
      const organizer = await this.prisma.organizer.findUniqueOrThrow({
        where: {
          id,
        },
      });
      return OrganizerService.convertToDTO(organizer);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateOrganizer(
    user: User,
    id: string,
    data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    try {
      const oldValue = await this.prisma.organizer.findUnique({
        where: {
          id,
        },
      });
      const updatedOrganizer = await this.prisma.organizer.update({
        where: {
          id,
        },
        data,
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'organizer',
        action: ActionENUM.EDITED,
        username: user.name,
        oldValue: JSON.stringify(oldValue),
        newValue: JSON.stringify(updatedOrganizer),
        priority: PriorityENUM.IMPORTANT,
      });
      return OrganizerService.convertToDTO(updatedOrganizer);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException();
      }
    }
  }

  public async deleteOrganizer(user: User, id: string): Promise<OrganizerDTO> {
    try {
      const deleteOrganizer = await this.prisma.organizer.delete({
        where: { id },
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'organizer',
        action: ActionENUM.DELETED,
        username: user.name,
        priority: PriorityENUM.IMPORTANT,
      });
      return OrganizerService.convertToDTO(deleteOrganizer);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException();
      }
    }
  }

  public static convertToDTO(organizer: Organizer): OrganizerDTO {
    const organizerDTO = new OrganizerDTO();
    organizerDTO.id = organizer.id;
    organizerDTO.createdAt = organizer.createdAt;
    organizerDTO.updatedAt = organizer.updatedAt;
    organizerDTO.name = organizer.name;
    organizerDTO.type = organizer.type.toString() as TypeEnum;
    return organizerDTO;
  }
}

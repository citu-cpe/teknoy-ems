import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Organizer } from '@prisma/client';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { PrismaService } from '../global/prisma/prisma.service';
import { OrganizerDTO, TypeEnum } from './dto/organizer.dto';
@Injectable()
export class OrganizerService {
  constructor(private readonly prisma: PrismaService) {}

  public async createNewOrganizer(organizerDTO: OrganizerDTO): Promise<any> {
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
    id: string,
    data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    try {
      const updatedOrganizer = await this.prisma.organizer.update({
        where: {
          id,
        },
        data,
      });
      return OrganizerService.convertToDTO(updatedOrganizer);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new BadRequestException();
      }
    }
  }

  public async deleteOrganizer(id: string): Promise<OrganizerDTO> {
    try {
      const deleteOrganizer = await this.prisma.organizer.delete({
        where: { id },
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

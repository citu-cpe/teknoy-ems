import { Injectable, NotFoundException } from '@nestjs/common';
import { Organizer } from '@prisma/client';
import { NotFoundError } from '@prisma/client/runtime';
import { PrismaService } from '../global/prisma/prisma.service';
import { OrganizerDTO, TypeEnum } from './dto/organizer.dto';
@Injectable()
export class OrganizerService {
  constructor(private readonly prisma: PrismaService) {}

  public async createNewOrganizer(
    organizerDTO: OrganizerDTO
  ): Promise<OrganizerDTO> {
    const newOrganizer = await this.prisma.organizer.create({
      data: organizerDTO,
    });
    return OrganizerService.convertToDTO(newOrganizer);
  }

  public async getAllOrganizer(): Promise<OrganizerDTO[]> {
    const allOrganizers = await this.prisma.organizer.findMany();
    return allOrganizers.map((organizer) =>
      OrganizerService.convertToDTO(organizer)
    );
  }

  public async getOrganizerById(id: string): Promise<OrganizerDTO> {
    try {
      const organizer = await this.prisma.organizer.findFirst({
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
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
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
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public static convertToDTO(organizer: Organizer): OrganizerDTO {
    const organizerDTO = new OrganizerDTO();
    organizerDTO.id = organizer.id;
    organizerDTO.name = organizer.name;
    organizerDTO.type = organizer.type.toString() as TypeEnum;
    return organizerDTO;
  }
}

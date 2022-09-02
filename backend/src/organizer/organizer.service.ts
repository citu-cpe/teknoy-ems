import { Injectable } from '@nestjs/common';
import { Organizer } from '@prisma/client';
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
    const organizer = await this.prisma.organizer.findFirst({
      where: {
        id,
      },
    });
    return OrganizerService.convertToDTO(organizer);
  }

  public async updateOrganizer(
    id: string,
    data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    const updatedOrganizer = await this.prisma.organizer.update({
      where: {
        id,
      },
      data,
    });
    return OrganizerService.convertToDTO(updatedOrganizer);
  }
  public async deleteOrganizer(id: string): Promise<OrganizerDTO> {
    const deleteOrganizer = await this.prisma.organizer.delete({
      where: { id },
    });
    return OrganizerService.convertToDTO(deleteOrganizer);
  }
  public static convertToDTO(organizer: Organizer): OrganizerDTO {
    const organizerDTO = new OrganizerDTO();
    organizerDTO.id = organizer.id;
    organizerDTO.name = organizer.name;
    organizerDTO.type = organizer.type.toString() as TypeEnum;
    return organizerDTO;
  }
}

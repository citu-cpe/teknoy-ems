import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { OrganizerDTO } from './dto/organizer.dto';
import { OrganizerService } from './organizer.service';

@Controller(OrganizerController.ORGANIZER_API_PATH)
export class OrganizerController {
  public static ORGANIZER_API_PATH = '/organizer';

  constructor(private readonly organizerService: OrganizerService) {}

  @Get()
  public async getAllOrganizers(): Promise<OrganizerDTO[]> {
    return this.organizerService.getAllOrganizer();
  }
  @Get(':id')
  public async getOrganizerByID(
    @Param('id') id: string
  ): Promise<OrganizerDTO> {
    return this.organizerService.getOrganizerById(id);
  }

  @Post()
  public async createNewOrganizer(
    @Body() data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    return this.organizerService.createNewOrganizer(data);
  }
  @Put(':id')
  public async updateOrganizer(
    @Param('id') id: string,
    @Body() data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    return this.organizerService.updateOrganizer(id, data);
  }
  @Delete(':id')
  public async deleteOrganizer(@Param('id') id: string): Promise<OrganizerDTO> {
    return this.organizerService.deleteOrganizer(id);
  }
}

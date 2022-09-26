import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
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
    @Req() { user }: RequestWithUser,
    @Body() data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    return this.organizerService.createNewOrganizer(user, data);
  }
  @Put(':id')
  public async updateOrganizer(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() data: OrganizerDTO
  ): Promise<OrganizerDTO> {
    return this.organizerService.updateOrganizer(user, id, data);
  }
  @Delete(':id')
  public async deleteOrganizer(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string
  ): Promise<OrganizerDTO> {
    return this.organizerService.deleteOrganizer(user, id);
  }
}

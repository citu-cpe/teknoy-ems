import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AnnouncementServices } from './announcement.service';
import { AnnouncementDTO } from './dto/announcement.dto';

@Controller(AnnouncementController.ANNOUNCEMENT_API_ROUTE)
export class AnnouncementController {
  public static ANNOUNCEMENT_API_ROUTE = '/announcement';
  public static ANNOUNCE_ID_ROUTE = '/:id';
  constructor(private readonly announcementService: AnnouncementServices) {}

  @Get()
  public async getAnnouncements(): Promise<AnnouncementDTO[]> {
    return this.announcementService.getAllAnnouncements();
  }
  @Get(AnnouncementController.ANNOUNCE_ID_ROUTE)
  public async getAnnouncementById(
    @Param('id') id: string
  ): Promise<AnnouncementDTO> {
    return this.announcementService.getAnnouncementById(id);
  }
  @Post()
  public async createAnnouncement(
    @Body() data: AnnouncementDTO
  ): Promise<AnnouncementDTO> {
    return this.announcementService.createAnnouncement(data);
  }
  @Put(AnnouncementController.ANNOUNCE_ID_ROUTE)
  public async updateAnnouncement(
    @Body() data: AnnouncementDTO,
    @Param('id') id: string
  ): Promise<AnnouncementDTO> {
    return this.announcementService.updateAnnouncement(id, data);
  }
  @Delete(AnnouncementController.ANNOUNCE_ID_ROUTE)
  public async deleteAnnouncement(
    @Param('id') id: string
  ): Promise<AnnouncementDTO> {
    return this.announcementService.deleteAnnouncement(id);
  }
}

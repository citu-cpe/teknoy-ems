import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { VenueDTO } from './dto/venue.dto';
import { VenueService } from './venue.service';

@Controller(VenueController.VENUE_API_PATH)
export class VenueController {
  public static readonly VENUE_API_PATH = '/venue';
  public static readonly VENUE_ID_ROUTE = '/:id';
  constructor(private readonly venueService: VenueService) {}
  @Post()
  public async createVenue(
    @Req() { user }: RequestWithUser,
    @Body() data: VenueDTO
  ): Promise<VenueDTO> {
    return this.venueService.createVenue(user, data);
  }
  @Get()
  public async getVenues(): Promise<VenueDTO[]> {
    return this.venueService.getAllVenue();
  }
  @Get(VenueController.VENUE_ID_ROUTE)
  public async getVenueById(@Param('id') id: string): Promise<VenueDTO> {
    return this.venueService.getVenueById(id);
  }
  @Delete(VenueController.VENUE_ID_ROUTE)
  public async deleteVenue(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string
  ): Promise<VenueDTO> {
    return this.venueService.deleteVenue(user, id);
  }
  @Put(VenueController.VENUE_ID_ROUTE)
  public async updateVenue(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() data: VenueDTO
  ): Promise<VenueDTO> {
    return this.venueService.updateVenue(user, id, data);
  }
}

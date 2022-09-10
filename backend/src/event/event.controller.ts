import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RequestWithUser } from '../authentication/types/request-with-user.interface';
import { ValidationErrorDTO } from '../shared/dto/validation-error.dto';
import { EventCreateDTO } from './dto/event-create.dto';
import { EventDTO } from './dto/event.dto';
import { SortedEquipmentsDTO } from './dto/sorted-equipments.dto';
import { SortedVenuesDTO } from './dto/sorted-venues.dto';
import { EventService } from './event.service';

@Controller(EventController.EVENT_API_PATH)
export class EventController {
  public static readonly EVENT_API_PATH = '/event';
  public static readonly EVENT_ID_API_PATH = '/:id';
  public static readonly SORTED_EQUIPMENTS_API_PATH = '/sorted-equipments';
  public static readonly SORTED_VENUES_API_PATH = '/sorted-venues';
  public static readonly VERIFY_EVENT_CREATION_API_PATH =
    '/verify-event-creation';

  constructor(private readonly eventService: EventService) {}

  @Get()
  public async getAllEvents(): Promise<EventDTO[]> {
    return this.eventService.getAllEvents();
  }

  @Get(EventController.EVENT_ID_API_PATH)
  public async getEventById(@Param('id') id: string): Promise<EventDTO> {
    return this.eventService.getEventById(id);
  }

  @Post()
  public async createEvent(
    @Req() { user }: RequestWithUser,
    @Body() dto: EventCreateDTO
  ): Promise<EventDTO> {
    return this.eventService.createEvent(dto, user);
  }

  @Put(EventController.EVENT_ID_API_PATH)
  public async updateEvent(
    @Req() { user }: RequestWithUser,
    @Param('id') id: string,
    @Body() dto: EventCreateDTO
  ): Promise<EventDTO> {
    return this.eventService.updateEvent(id, dto, user);
  }

  @Delete(EventController.EVENT_ID_API_PATH)
  public async deleteEvent(@Param('id') id: string): Promise<EventDTO> {
    return this.eventService.deleteEvent(id);
  }

  @Get(
    EventController.EVENT_ID_API_PATH +
      EventController.SORTED_EQUIPMENTS_API_PATH
  )
  public async getSortedEquipments(
    @Param('id') id: string
  ): Promise<SortedEquipmentsDTO> {
    return this.eventService.getSortedEquipmentsByEventId(id);
  }

  @Get(
    EventController.EVENT_ID_API_PATH +
      EventController.SORTED_EQUIPMENTS_API_PATH
  )
  public async getSortedVenues(
    @Param('id') id: string
  ): Promise<SortedVenuesDTO> {
    return this.eventService.getSortedVenuesByEventId(id);
  }

  @Post(EventController.VERIFY_EVENT_CREATION_API_PATH)
  public async verifyEventCreation(
    @Body() dto: EventCreateDTO
  ): Promise<ValidationErrorDTO> {
    return this.eventService.verifyEventCreation(dto);
  }
}

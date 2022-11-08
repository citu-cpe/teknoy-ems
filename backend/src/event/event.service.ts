import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../global/prisma/prisma.service';
import { EventDTO } from './dto/event.dto';
import {
  Equipment,
  EquipmentsOnEvents,
  Event,
  Organizer,
  User,
  Venues,
  VenuesOnEvents,
} from '@prisma/client';
import {
  EventCreateDTO,
  EventTypeEnum,
  StatusEnum,
  ViewAccessEnum,
} from './dto/event-create.dto';
import { UserService } from '../user/user.service';
import { OrganizerService } from '../organizer/organizer.service';
import { EquipmentService } from '../equipment/equipment.service';
import { VenueService } from '../venue/venue.service';
import {
  NotFoundError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';
import { SortedEquipmentsDTO } from './dto/sorted-equipments.dto';
import { SortedVenuesDTO } from './dto/sorted-venues.dto';
import { AvailabilityEnum, ScheduleDTO } from '../schedule/dto/schedule.dto';
import { ValidationErrorDTO } from '../shared/dto/validation-error.dto';
import { ErrorFieldDTO } from '../shared/dto/error-field.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActionENUM, PriorityENUM } from '../activity-log/dto/activity-log.dto';

@Injectable()
export class EventService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly equipmentService: EquipmentService,
    private readonly venueService: VenueService,
    private readonly eventEmitter: EventEmitter2
  ) {}

  public async createEvent(dto: EventCreateDTO, user: User): Promise<EventDTO> {
    if (dto.status === StatusEnum.RESERVED) {
      throw new BadRequestException(
        'Cannot have RESERVED status on event creation'
      );
    }

    const validationErrorDTO = await this.verifyEventCreation(dto);

    if (validationErrorDTO.hasErrors) {
      throw new BadRequestException(validationErrorDTO, 'Error creating event');
    }

    const event = await this.prismaService.event.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        startTime: dto.startTime,
        endTime: dto.endTime,
        contactPerson: dto.contactPerson,
        contact: dto.contact,
        approvedBy: dto.approvedBy,
        viewAccess: dto.viewAccess,
        type: dto.type,
        additionalNotes: dto.additionalNotes,
        organizer: {
          connect: { id: dto.organizerId },
        },
        encodedBy: { connect: { id: user.id } },
        equipments: {
          create: dto.equipmentIds.map((id) => ({
            equipmentId: id,
          })),
        },
        venues: {
          create: dto.venueIds.map((id) => ({
            venuesId: id,
          })),
        },
      },
      include: {
        encodedBy: true,
        organizer: true,
        equipments: { include: { equipment: true } },
        venues: { include: { venue: true } },
      },
    });

    await this.addSchedules(dto);

    this.eventEmitter.emit('create.logs', {
      entityName: 'event',
      entityId: event.id,
      newValue: JSON.stringify(event),
      action: ActionENUM.ADDED,
      userId: user.id,
      priority: PriorityENUM.IMPORTANT,
    });
    return EventService.convertToDTO(event);
  }

  public async getAllEvents(): Promise<EventDTO[]> {
    const events = await this.prismaService.event.findMany({
      include: {
        encodedBy: true,
        organizer: true,
        equipments: { include: { equipment: true } },
        venues: { include: { venue: true } },
      },
    });

    return events.map((e) => EventService.convertToDTO(e));
  }

  public async getEventById(id: string): Promise<EventDTO> {
    try {
      const event = await this.prismaService.event.findUniqueOrThrow({
        where: { id },
        include: {
          encodedBy: true,
          organizer: true,
          equipments: { include: { equipment: true } },
          venues: { include: { venue: true } },
        },
      });

      return EventService.convertToDTO(event);
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public async updateEvent(
    id: string,
    dto: EventCreateDTO,
    user: User
  ): Promise<EventDTO> {
    const validationErrorDTO = await this.verifyEventCreation(dto);

    if (validationErrorDTO.hasErrors) {
      throw new BadRequestException(validationErrorDTO, 'Error creating event');
    }

    try {
      await this.prismaService.equipmentsOnEvents.deleteMany({
        where: { eventId: id },
      });

      await this.prismaService.venuesOnEvents.deleteMany({
        where: { eventId: id },
      });

      const oldValue = await this.prismaService.event.findUniqueOrThrow({
        where: { id },
        include: {
          encodedBy: true,
          organizer: true,
          equipments: {
            include: { equipment: true },
          },
          venues: { include: { venue: true } },
        },
      });

      if (
        oldValue.status !== dto.status &&
        (dto.status === StatusEnum.CANCELED ||
          dto.status === StatusEnum.DONE ||
          dto.status === StatusEnum.POSTPONED)
      ) {
        await this.prismaService.schedule.updateMany({
          data: { availability: AvailabilityEnum.AVAILABLE },
          where: { startTime: oldValue.startTime, endTime: oldValue.endTime },
        });
      }

      const event = await this.prismaService.event.update({
        where: { id },
        data: {
          title: dto.title,
          description: dto.description,
          status: dto.status,
          startTime: dto.startTime,
          endTime: dto.endTime,
          contactPerson: dto.contactPerson,
          contact: dto.contact,
          approvedBy: dto.approvedBy,
          viewAccess: dto.viewAccess,
          type: dto.type,
          additionalNotes: dto.additionalNotes,
          organizer: {
            connect: { id: dto.organizerId },
          },
          equipments: {
            create: dto.equipmentIds.map((eqId) => ({
              equipmentId: eqId,
            })),
          },
          venues: {
            create: dto.venueIds.map((vId) => ({
              venuesId: vId,
            })),
          },
        },
        include: {
          encodedBy: true,
          organizer: true,
          equipments: { include: { equipment: true } },
          venues: { include: { venue: true } },
        },
      });

      this.eventEmitter.emit('create.logs', {
        entityName: 'event',
        entityId: event.id,
        newValue: JSON.stringify(event),
        oldValue: JSON.stringify(oldValue),
        action: ActionENUM.EDITED,
        userId: user.id,
        priority: PriorityENUM.IMPORTANT,
      });

      return EventService.convertToDTO(event);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async deleteEvent(id: string, user: User) {
    await this.deleteSchedules(id);

    try {
      const event = await this.prismaService.event.delete({
        where: { id },
        include: {
          encodedBy: true,
          organizer: true,
          equipments: { include: { equipment: true } },
          venues: { include: { venue: true } },
        },
      });
      this.eventEmitter.emit('create.logs', {
        entityName: 'event',
        entityId: event.id,
        newValue: JSON.stringify(event),
        action: ActionENUM.DELETED,
        userId: user.id,
        priority: PriorityENUM.IMPORTANT,
      });
      return EventService.convertToDTO(event);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
    }
  }

  public async getSortedEquipments(
    startTime: Date,
    endTime: Date
  ): Promise<SortedEquipmentsDTO> {
    return this.equipmentService.getSortedEquipments(startTime, endTime);
  }

  public async getSortedVenues(
    startTime: Date,
    endTime: Date
  ): Promise<SortedVenuesDTO> {
    return this.venueService.getSortedVenues(startTime, endTime);
  }

  public async verifyEventCreation(
    dto: EventCreateDTO
  ): Promise<ValidationErrorDTO> {
    if (dto.id) {
      await this.deleteSchedules(dto.id);
    }

    const validationErrorDTO = new ValidationErrorDTO();

    const unavailableEquipmentIds = (
      await this.getSortedEquipments(dto.startTime, dto.endTime)
    ).unavailableEquipments.map((e) => e.id);

    const includesUnavailableEquipment = dto.equipmentIds.some((eqId) =>
      unavailableEquipmentIds.includes(eqId)
    );

    if (includesUnavailableEquipment) {
      const errorFieldDTO = new ErrorFieldDTO();
      errorFieldDTO.errorMessage = 'Invalid equipments provided';
      errorFieldDTO.fieldName = 'equipment';
      validationErrorDTO.errorFields.push(errorFieldDTO);
    }

    const unavailableVenueIds = (
      await this.getSortedVenues(dto.startTime, dto.endTime)
    ).unavailableVenues.map((v) => v.id);

    const includesUnavailableVenues = dto.venueIds.some((vId) =>
      unavailableVenueIds.includes(vId)
    );

    if (includesUnavailableVenues) {
      const errorFieldDTO = new ErrorFieldDTO();
      errorFieldDTO.errorMessage = 'Invalid venues provided';
      errorFieldDTO.fieldName = 'venue';
      validationErrorDTO.errorFields.push(errorFieldDTO);
    }

    validationErrorDTO.hasErrors = validationErrorDTO.errorFields.length > 0;

    if (dto.id) {
      await this.addSchedules(dto);
    }

    return validationErrorDTO;
  }

  private async addSchedules(dto: EventCreateDTO) {
    const scheduleDTO: ScheduleDTO = {
      startTime: dto.startTime,
      endTime: dto.endTime,
      availability: AvailabilityEnum.UNAVAILABLE,
    };

    await Promise.all(
      dto.equipmentIds.map(async (eqId) => {
        await this.equipmentService.addScheduletoEquipment(eqId, scheduleDTO);
      })
    );

    await Promise.all(
      dto.venueIds.map(async (vId) => {
        await this.venueService.addScheduletoVenue(vId, scheduleDTO);
      })
    );
  }

  private async deleteSchedules(id: string) {
    try {
      const event = await this.prismaService.event.findUniqueOrThrow({
        where: { id },
        select: { startTime: true, endTime: true },
      });

      const equipmentIds = (
        await this.prismaService.event.findUniqueOrThrow({
          where: { id },
          select: { equipments: { select: { equipmentId: true } } },
        })
      ).equipments.map((e) => e.equipmentId);

      await this.prismaService.schedule.deleteMany({
        where: {
          AND: {
            equipmentId: { in: equipmentIds },
            startTime: event.startTime,
            endTime: event.endTime,
          },
        },
      });

      const venueIds = (
        await this.prismaService.event.findUniqueOrThrow({
          where: { id },
          select: { venues: { select: { venuesId: true } } },
        })
      ).venues.map((v) => v.venuesId);

      await this.prismaService.schedule.deleteMany({
        where: {
          AND: {
            venuesId: { in: venueIds },
            startTime: event.startTime,
            endTime: event.endTime,
          },
        },
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
    }
  }

  public static convertToDTO(
    event: Event & {
      encodedBy: User;
      organizer: Organizer;
      equipments: (EquipmentsOnEvents & {
        equipment: Equipment;
      })[];
      venues: (VenuesOnEvents & {
        venue: Venues;
      })[];
    }
  ): EventDTO {
    const eventDTO = new EventDTO();
    eventDTO.id = event.id;
    eventDTO.createdAt = event.createdAt;
    eventDTO.updatedAt = event.updatedAt;
    eventDTO.title = event.title;
    eventDTO.description = event.description;
    eventDTO.status = event.status.toString() as StatusEnum;
    eventDTO.startTime = event.startTime;
    eventDTO.endTime = event.endTime;
    eventDTO.contactPerson = event.contactPerson;
    eventDTO.contact = event.contact;
    eventDTO.approvedBy = event.approvedBy;
    eventDTO.viewAccess = event.viewAccess.toString() as ViewAccessEnum;
    eventDTO.type = event.type.toString() as EventTypeEnum;
    eventDTO.additionalNotes = event.additionalNotes;
    eventDTO.encodedBy = UserService.convertToDTO(event.encodedBy);
    eventDTO.organizer = OrganizerService.convertToDTO(event.organizer);
    eventDTO.equipments = event.equipments
      .map((eoe) => eoe.equipment)
      .map((e) => EquipmentService.convertToDTO(e));
    eventDTO.venues = event.venues
      .map((voe) => voe.venue)
      .map((v) => VenueService.convertToDTO(v));

    return eventDTO;
  }
}

import {
  EventCreateDTO,
  EventCreateDTOStatusEnum,
  EventDTO,
} from 'generated-api';

export const convertToEventCreateDTO = (eventDTO: EventDTO): EventCreateDTO => {
  let eventCreate: EventCreateDTO;

  const equipmentIds = eventDTO.equipments.map((eq): string => {
    if (eq.id) {
      return eq.id;
    }

    return '';
  });

  const venuesIds = eventDTO.venues.map((v): string => {
    if (v.id) {
      return v.id;
    }

    return '';
  });

  const organizerId = eventDTO.organizer.id;

  const status = Object.values(EventCreateDTOStatusEnum).find((value) => {
    if (value) {
      return value === eventDTO.status.toString();
    }

    return '';
  });

  return {
    ...eventDTO,
    equipmentIds,
    venuesIds,
    organizerId,
  } as unknown as EventCreateDTO;
};

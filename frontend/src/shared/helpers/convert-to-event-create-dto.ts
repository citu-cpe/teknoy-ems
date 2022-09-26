import { EventCreateDTO, EventDTO } from 'generated-api';

export const convertToEventCreateDTO = (eventDTO: EventDTO): EventCreateDTO => {
  // just remove the `venues` & `equipments` fields
  const formattedEventDTO: any = {
    ...eventDTO,
  };

  formattedEventDTO.venues = undefined;
  formattedEventDTO.equipments = undefined;

  const equipmentIds = eventDTO.equipments.map((eq): string => {
    if (eq.id) {
      return eq.id;
    }

    return '';
  });

  const venueIds = eventDTO.venues.map((v): string => {
    if (v.id) {
      return v.id;
    }

    return '';
  });

  const organizerId = eventDTO.organizer.id;

  const eventCreateDTO = {
    ...formattedEventDTO,
    equipmentIds,
    venueIds,
    organizerId,
  } as unknown as EventCreateDTO;

  return eventCreateDTO;
};

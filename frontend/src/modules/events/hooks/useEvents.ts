import { EventCreateDTO } from 'generated-api';
import { useContext } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

export const useEvents = () => {
  const api = useContext(ApiContext);

  const addEvent = useMutation((eventCreateDTO: EventCreateDTO) =>
    api.createEvent(eventCreateDTO)
  );

  const editEvent = useMutation((eventCreateDTO: EventCreateDTO) =>
    api.updateEvent(eventCreateDTO.id as string, eventCreateDTO)
  );

  const getEventById = useMutation((id: string) => api.getEventById(id));

  const fetchAllEvents = useMutation(() => api.getAllEvents());

  return {
    addEvent,
    editEvent,
    getEventById,
    fetchAllEvents,
  };
};

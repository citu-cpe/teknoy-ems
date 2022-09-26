import { EventCreateDTO, EventDTO } from 'generated-api';
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

  const verifyEvent = useMutation(
    (eventCreateDTO: EventCreateDTO) => api.verifyEventCreation(eventCreateDTO),
    {
      onSuccess: (data) => {
        console.log(data.data);
        console.log({ data });
      },
      onError: (data) => {
        console.log({ data });
      },
    }
  );

  const getEventById = useMutation((id: string) => api.getEventById(id));

  return {
    addEvent,
    editEvent,
    verifyEvent,
    getEventById,
  };
};

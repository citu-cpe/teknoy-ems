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
        // TODO remove these callbacks after event verify
        // console.log('success?');
        // console.log(data.data);
        // console.log({ data });
      },
      onError: (data) => {
        // TODO remove these callbacks after event verify
        // console.log('error');
        // console.log({ data });
      },
    }
  );

  const getEventById = useMutation((id: string) => api.getEventById(id));

  const getSortedEquipments = useMutation(
    async (dto: EventCreateDTO) => await api.getSortedEquipments(dto),
    {
      onSuccess: (data) => {
        console.log('getSortedEquipments Success');
        console.log(data.data);
      },
    }
  );

  const getSortedVenues = useMutation((eventCreateDTO: EventCreateDTO) =>
    api.getSortedVenues(eventCreateDTO)
  );

  return {
    addEvent,
    editEvent,
    verifyEvent,
    getEventById,
    getSortedEquipments,
    getSortedVenues,
  };
};

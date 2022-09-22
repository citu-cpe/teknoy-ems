import { Center, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import {
  CalendarOptions,
  EventClickArg,
  EventInput,
} from '@fullcalendar/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { EventAddForm } from './EventAddForm';
import { EventAddSuccess } from './EventAddSuccess';
import { EventView } from './EventView';

export const EventsCalendar = ({
  ...props
}: CalendarOptions | Readonly<CalendarOptions>) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const [events, setEvents] = useState<EventInput[] | undefined>([]);
  const eventToView = useRef<string | null>(null);
  const eventToEdit = useRef<EventDTO | null>(null);
  const eventToDelete = useRef<EventDTO | null>(null);

  const [refresh, setRefresh] = useState(false);

  const {
    onOpen: onViewModalOpen,
    isOpen: isViewModalOpen,
    onClose: onViewModalClose,
  } = useDisclosure();

  const {
    onOpen: onEditModalOpen,
    isOpen: isEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const fetchEvents = useMutation(() => api.getAllEvents(), {
    onSuccess: (data) => {
      setEvents(() => formatEvents(data.data));
    },
  });

  const formatEvents = (events: EventDTO[]): EventInput[] => {
    let formattedEvents: EventInput[];
    formattedEvents = events.map((ev) => {
      let event: EventInput;
      event = {
        ...ev,
        start: ev.startTime,
        end: ev.endTime,
      };
      return event;
    });

    return formattedEvents;
  };

  const deleteEvents = useMutation(
    (eventDTO: EventDTO) => api.deleteEvent(eventDTO.id as string),
    {
      onSuccess: () => {
        fetchAllEvents();
      },
    }
  );

  const fetchAllEvents = () => {
    fetchEvents.mutate();
  };

  useEffect(() => {
    fetchAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleEdit = (eventDTO: EventDTO) => {
    onEditModalOpen();
    eventToEdit.current = eventDTO;
  };

  const handleDelete = (eventDTO: EventDTO) => {
    onDeleteDialogOpen();
    eventToDelete.current = eventDTO;
  };

  const handleDeleteConfirm = async () => {
    const eventDTO = eventToDelete.current;

    if (eventDTO === null) {
      return;
    }

    await deleteEvents.mutateAsync(eventDTO);
    toast({ title: 'Deleted event successfully' });
    onDeleteDialogClose();
  };

  const handleEditComplete = () => {
    fetchAllEvents();
    onEditModalClose();
  };

  const [newEventDTO, setEventDTO] = useState<EventDTO | undefined>(undefined);

  const {
    onOpen: onAddOpen,
    isOpen: isAddOpen,
    onClose: onClose,
  } = useDisclosure();

  const {
    onOpen: onSuccessOpen,
    isOpen: isSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const handleComplete = (newEvent: EventDTO) => {
    setEventDTO(newEvent);
    onClose();
    onSuccessOpen();
  };

  const handleRegisterAgain = () => {
    setEventDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setEventDTO(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  if (fetchEvents.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  const handleEventClick = (eventInfo: EventClickArg) => {
    // console.log({ eventInfo });
    eventToView.current = eventInfo.event.id;
    onViewModalOpen();
  };

  const handleDateClick = (dateInfo: DateClickArg) => {
    // console.log({ dateInfo });
    onAddOpen();
  };

  return (
    <>
      {events && (
        <FullCalendar
          timeZone='Asia/Manila'
          plugins={[
            timeGridPlugin,
            dayGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView='dayGridMonth'
          initialEvents={events}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
          }}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          selectable
          editable
          {...props}
        />
      )}

      <Modal title='New Event' isOpen={isAddOpen} onClose={onClose} size='4xl'>
        <EventAddForm onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <EventAddSuccess
          event={newEventDTO}
          onClose={handleSuccessClose}
          onConfirm={handleRegisterAgain}
        />
      </Modal>

      {eventToView.current && (
        <Modal
          title='Event View'
          isOpen={isViewModalOpen}
          onClose={onViewModalClose}
        >
          <EventView id={eventToView.current} />
        </Modal>
      )}
    </>
  );
};

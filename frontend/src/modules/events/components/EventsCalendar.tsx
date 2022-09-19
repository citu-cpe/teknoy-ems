import { Center, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import {
  CalendarOptions,
  EventInput,
  EventClickArg,
} from '@fullcalendar/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { EventDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { ApiContext } from '../../../shared/providers/ApiProvider';

interface EventsCalendarProps {
  refresh: boolean;
}

export const EventsCalendar = ({
  refresh,
  ...props
}: EventsCalendarProps & (CalendarOptions | Readonly<CalendarOptions>)) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const [events, setEvents] = useState<EventInput[] | undefined>([]);
  const eventToEdit = useRef<EventDTO | null>(null);
  const eventToDelete = useRef<EventDTO | null>(null);

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
      console.log({ data });
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
    // let event: EventInput;
    // event.title
    // event.sta

    console.log({ formattedEvents });
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

  if (fetchEvents.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  const handleEventClick = (eventInfo: EventClickArg) => {
    console.log({ eventInfo });
  };

  const handleDateClick = (dateInfo: DateClickArg) => {
    console.log({ dateInfo });
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
          editable
          selectable
          {...props}
        />
      )}
    </>
  );
};

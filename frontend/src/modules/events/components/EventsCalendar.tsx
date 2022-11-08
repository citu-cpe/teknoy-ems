import { Center, Spinner, useDisclosure } from '@chakra-ui/react';
import {
  CalendarOptions,
  EventClickArg,
  EventInput,
} from '@fullcalendar/common';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
  EventCreateDTO,
  EventCreateDTOStatusEnum,
  EventDTO,
  EventDTOStatusEnum,
} from 'generated-api';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Dialog, LinkButton, Modal } from '../../../shared/components/elements';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { valuesAreEqual } from '../../../shared/helpers';
import { convertToEventCreateDTO } from '../../../shared/helpers/convert-to-event-create-dto';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { useEvents } from '../hooks';
import { useUpdateEventsCalendar } from '../hooks/useUpdateEventsCalendar';
import { EventAddForm } from './EventAddForm';
import { EventAddSuccess } from './EventAddSuccess';
import { getEventStatusColor } from './EventStatus';
import { EventView } from './EventView';

export const EventsCalendar = ({
  ...props
}: CalendarOptions | Readonly<CalendarOptions>) => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const router = useRouter();
  const socket = useContext(SocketContext);
  const { editEvent } = useEvents();

  const [events, setEvents] = useState<EventInput[] | undefined>([]);
  const [newEventDTO, setEventDTO] = useState<EventDTO | undefined>(undefined);
  const [refresh, setRefresh] = useState(false);

  const eventToView = useRef<string | null>(null);
  const eventToEdit = useRef<EventDTO | null>(null);
  const eventToDelete = useRef<EventDTO | null>(null);

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

  const fetchEvents = useMutation(() => api.getAllEvents(), {
    onSuccess: (data) => {
      setEvents(() => formatEvents(data.data));
    },
  });

  const deleteEvents = useMutation(
    (eventDTO: EventDTO) => api.deleteEvent(eventDTO.id as string),
    {
      onSuccess: () => {
        fetchAllEvents();
      },
    }
  );
  const handleWebSocketsTable = () => {
    setRefresh(!refresh);
  };
  useUpdateEventsCalendar(handleWebSocketsTable, refresh);
  const fetchAllEvents = () => {
    fetchEvents.mutate();
  };

  useEffect(() => {
    fetchAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const formatEvents = (events: EventDTO[]): EventInput[] => {
    let formattedEvents: EventInput[];
    formattedEvents = events.map((ev) => {
      const statusColor = getEventStatusColor(ev.status);

      let event: EventInput;
      event = {
        ...ev,
        start: ev.startTime,
        end: ev.endTime,
        backgroundColor: statusColor,
        borderColor: statusColor,
      };
      return event;
    });

    return formattedEvents;
  };

  const handleComplete = (newEvent: EventDTO) => {
    setEventDTO(newEvent);
    onClose();
    onSuccessOpen();
  };

  const handleAddAgain = () => {
    toast({ title: 'Added event successfully' });
    setEventDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setEventDTO(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  const handleEdit = (eventCreateDTO: EventDTO) => {
    onViewModalClose();
    onEditModalOpen();
    eventToEdit.current = eventCreateDTO;
  };

  const handleEditModalClose = () => {
    eventToEdit.current = null;
    onEditModalClose();
  };

  const handleEditComplete = (eventDTO: EventDTO) => {
    const initialEventValue = { ...eventToEdit.current, updatedAt: '' };
    const updatedEventValue = { ...eventDTO, updatedAt: '' };

    if (valuesAreEqual(initialEventValue, updatedEventValue)) {
      toast({ title: 'No event changes', status: 'info' });
    } else {
      toast({ title: 'Updated event successfully' });
      fetchAllEvents();
    }

    handleEditModalClose();
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
    socket?.emit(WebSocketEnum.UPDATE_TABLES, 'EVENT');
    toast({ title: 'Deleted event successfully' });
    onDeleteDialogClose();
    onViewModalClose();
  };

  const handleEventClick = (eventInfo: EventClickArg) => {
    eventToView.current = eventInfo.event.id;
    onViewModalOpen();
  };

  const handleQuickApprove = (event: EventDTO) => {
    const eventCreate = convertToEventCreateDTO(event);
    let approvedEventCreate: EventCreateDTO = {
      ...eventCreate,
      status: EventCreateDTOStatusEnum.Reserved,
    };

    editEvent.mutate(approvedEventCreate, {
      onSuccess: () => {
        toast({ title: 'Approved event successfully' });
      },
      onError: () => {
        toast({ title: 'Approved event failed', status: 'error' });
      },
    });
  };

  /**
   * feature function currently commented for future development
   * Reason: Users can mistakenly click calendar Dates very easily
   */
  // const handleDateClick = (dateInfo: DateClickArg) => {
  //   onAddOpen();
  // };

  const handleReserve = () => {
    router.push('/events/reserve');
  };

  if (fetchEvents.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <>
      {events && (
        <FullCalendar
          locale='en'
          plugins={[
            timeGridPlugin,
            dayGridPlugin,
            listPlugin,
            interactionPlugin,
          ]}
          initialView='timeGridWeek'
          initialEvents={events}
          slotMinTime='06:00'
          slotMaxTime='24:00'
          eventClick={handleEventClick}
          eventDragStop={() => {
            toast({
              status: 'error',
              title: 'Quick updates through dragging is not supported',
            });
          }}
          // eventMouseEnter={}
          eventStartEditable={false}
          eventDurationEditable={false}
          height='100%'
          selectable
          editable
          nowIndicator
          expandRows
          headerToolbar={{
            left: 'monthView,weekView,dayView,listView',
            center: 'title',
            right: 'prev,today,next reserve',
          }}
          views={{
            monthView: {
              buttonText: 'Month',
              type: 'dayGridMonth',
            },
            weekView: {
              buttonText: 'Week',
              type: 'timeGridWeek',
            },
            dayView: {
              buttonText: 'Day',
              type: 'timeGridDay',
            },
            listView: {
              buttonText: 'List',
              type: 'listYear',
            },
          }}
          customButtons={{
            reserve: {
              text: 'Reserve',
              click: handleReserve,
            },
            refresh: {
              text: '-',
              click: handleReserve,
            },
          }}
          {...props}
        />
      )}

      <Modal
        title='New Event'
        isOpen={isAddOpen}
        onClose={onClose}
        headerActions={
          <LinkButton
            size='sm'
            label='Switch Page View'
            route='/events/reserve'
          />
        }
        size='4xl'
      >
        <EventAddForm
          initialEventValue={eventToEdit.current}
          onComplete={handleComplete}
        />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <EventAddSuccess
          event={newEventDTO}
          onClose={handleSuccessClose}
          onConfirm={handleAddAgain}
        />
      </Modal>

      {eventToEdit.current && (
        <Modal
          title='Update Event'
          isOpen={isEditModalOpen}
          onClose={handleEditModalClose}
          size='4xl'
        >
          <EventAddForm
            initialEventValue={eventToEdit.current}
            onComplete={handleEditComplete}
          />
        </Modal>
      )}

      {eventToView.current && (
        <Modal
          title='Event View'
          isOpen={isViewModalOpen}
          onClose={onViewModalClose}
        >
          <EventView
            id={eventToView.current}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onApprove={handleQuickApprove}
          />
        </Modal>
      )}

      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={eventToDelete.current?.title.toString()}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};

import { Button, Center, Flex, Spacer, Spinner } from '@chakra-ui/react';
import { EventDTO } from 'generated-api';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';
import { useEvents } from '../hooks/';

interface EventViewProps {
  id: string | null;
  onDelete: (eventDTO: EventDTO) => void;
  onEdit: (eventDTO: EventDTO) => void;
}

export const EventView = ({ id, onDelete, onEdit }: EventViewProps) => {
  const { getEventById } = useEvents();

  const [event, setEvent] = useState<EventDTO | null>(null);
  const [editActionIsLoading, setEditActionIsLoading] = useState(false);
  const [deleteActionIsLoading, setDeleteActionIsLoading] = useState(false);

  useEffect(() => {
    if (id !== null) {
      getEventById.mutate(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getEventById.isSuccess) {
      setEvent(getEventById.data.data);
    }
  }, [getEventById]);

  const handleDelete = () => {
    setDeleteActionIsLoading(true);
    if (event) {
      onDelete(event);
      setDeleteActionIsLoading(false);
    }
  };
  
  const handleEdit = () => {
    setEditActionIsLoading(true);
    if (event) {
      onEdit(event);
      setDeleteActionIsLoading(false);
    }
  };

  if (getEventById.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <>
      <ModalTable>
        {event && (
          <FieldTableBody
            data={[
              {
                label: 'Title',
                value: event?.title,
                type: 'text',
              },
              {
                label: 'Description',
                value: event?.description,
                type: event?.description.length > 0 ? 'textarea' : 'text',
              },
              {
                label: 'Status',
                value: event?.status,
                type: 'text',
              },
              {
                label: 'Start Time',
                value: `${moment(event?.startTime).format(
                  'h:mm A MMM DD'
                )} (${moment(event?.startTime).fromNow()})`,
                type: 'text',
              },
              {
                label: 'End Time',
                value: `${moment(event?.endTime).format(
                  'h:mm A MMM DD'
                )} (${moment(event?.endTime).fromNow()})`,
                type: 'text',
              },
              {
                label: 'Type',
                value: event?.type,
                type: 'text',
              },
              {
                label: 'Venues',
                value:
                  event?.venues.length > 0
                    ? event?.venues.map((v) => v.name).join(', ')
                    : 'None',
                type: event?.venues.length > 0 ? 'textarea' : 'text',
              },
              {
                label: 'Equipment',
                value:
                  event?.equipments.length > 0
                    ? event?.equipments.map((eq) => eq.name).join(', ')
                    : 'None',
                type: event?.equipments.length > 0 ? 'textarea' : 'text',
              },
              {
                label: 'Additional Notes',
                value: event?.additionalNotes,
                type: 'textarea',
              },
              {
                label: 'Contact Person',
                value: event?.contactPerson,
                type: 'text',
              },
              {
                label: 'Contact',
                value: event?.contact,
                type: 'text',
              },
              {
                label: 'Encoded by',
                value: event?.encodedBy.name,
                type: 'text',
              },
              {
                label: 'Encoded at',
                value: moment(event?.createdAt).format('MMMM DD, YYYY hh:mm A'),
                type: 'text',
              },
            ]}
          />
        )}
      </ModalTable>

      <Flex w='full' h='full'>
        <Button
          variant='outline'
          color='errorColor'
          borderColor='errorBg'
          data-cy='delete-submit-btn'
          formNoValidate
          isLoading={deleteActionIsLoading}
          loadingText='Deleting...'
          onClick={handleDelete}
        >
          Delete Event
        </Button>
        <Spacer />
        <Button
          variant='solid'
          data-cy='update-submit-btn'
          formNoValidate
          isLoading={editActionIsLoading}
          loadingText='Editing...'
          onClick={handleEdit}
        >
          Update Event
        </Button>
      </Flex>
    </>
  );
};

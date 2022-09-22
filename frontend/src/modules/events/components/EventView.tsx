import { Center, Spinner } from '@chakra-ui/react';
import { EventDTO } from 'generated-api';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';
import { useEvents } from '../hooks/useEvents';

interface EventViewProps {
  id: string | null;
}

export const EventView = ({ id }: EventViewProps) => {
  const { getEventById } = useEvents();

  const [event, setEvent] = useState<EventDTO | null>(null);

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
                label: 'Status',
                value: event?.status,
                type: 'text',
              },
              {
                label: 'Type',
                value: event?.type,
                type: 'text',
              },
              {
                label: 'Encoded by',
                value: event?.encodedBy.name,
                type: 'text',
              },
              {
                label: 'Additional Notes',
                value: event?.additionalNotes,
                type: 'textarea',
              },
            ]}
          />
        )}
      </ModalTable>
    </>
  );
};

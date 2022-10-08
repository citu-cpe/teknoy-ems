import { EventDTO } from 'generated-api';
import moment from 'moment';
import { ModalInfo } from '../../../shared/components/elements';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';

interface EventAddSuccessProps {
  event: EventDTO | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const EventAddSuccess = ({
  event,
  onClose,
  onConfirm,
}: EventAddSuccessProps) => {
  return (
    <>
      <ModalInfo
        title='Event has been added'
        onClose={onClose}
        onConfirm={onConfirm}
        closeLabel='Done'
        confirmLabel='Reserve again'
      >
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
      </ModalInfo>
    </>
  );
};

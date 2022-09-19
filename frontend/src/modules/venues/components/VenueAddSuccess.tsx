import { VenueDTO } from 'generated-api';
import { ModalInfo } from '../../../shared/components/elements';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';

interface VenueAddSuccessProps {
  venue: VenueDTO | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const VenueAddSuccess = ({
  venue,
  onClose,
  onConfirm,
}: VenueAddSuccessProps) => {
  return (
    <>
      <ModalInfo
        title='Venue has been added'
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <ModalTable>
          {venue && (
            <FieldTableBody
              data={[
                {
                  label: 'Name',
                  value: venue?.name,
                  type: 'text',
                },
                {
                  label: 'Type',
                  value: venue?.notes,
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

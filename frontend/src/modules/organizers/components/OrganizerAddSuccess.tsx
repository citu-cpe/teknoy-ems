import { OrganizerDTO } from 'generated-api';
import { ModalInfo } from '../../../shared/components/elements';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';

interface OrganizerAddSuccessProps {
  organizer: OrganizerDTO | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const OrganizerAddSuccess = ({
  organizer,
  onClose,
  onConfirm,
}: OrganizerAddSuccessProps) => {
  return (
    <>
      <ModalInfo
        title='Organizer has been added'
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <ModalTable>
          {organizer && (
            <FieldTableBody
              data={[
                {
                  label: 'Name',
                  value: organizer?.name,
                  type: 'text',
                },
                {
                  label: 'Type',
                  value: organizer?.type,
                  type: 'text',
                },
              ]}
            />
          )}
        </ModalTable>
      </ModalInfo>
    </>
  );
};

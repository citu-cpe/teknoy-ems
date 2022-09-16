import { EquipmentDTO } from 'generated-api';
import { ModalInfo } from '../../../shared/components/elements';
import { FieldTableBody } from '../../../shared/components/table';
import { ModalTable } from '../../../shared/components/table/FieldTable';

interface EquipmentAddSuccessProps {
  equipment: EquipmentDTO | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export const EquipmentAddSuccess = ({
  equipment,
  onClose,
  onConfirm,
}: EquipmentAddSuccessProps) => {
  return (
    <>
      <ModalInfo
        title='Equipment has been added'
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <ModalTable>
          {equipment && (
            <FieldTableBody
              data={[
                {
                  label: 'Name',
                  value: equipment?.name,
                  type: 'text',
                },
                {
                  label: 'Type',
                  value: equipment?.type,
                  type: 'text',
                },
                {
                  label: 'Brand',
                  value: equipment?.brand,
                  type: 'text',
                },
                {
                  label: 'Serial',
                  value: equipment?.serial,
                  type: 'text',
                },
                {
                  label: 'Notes',
                  value: equipment?.notes,
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

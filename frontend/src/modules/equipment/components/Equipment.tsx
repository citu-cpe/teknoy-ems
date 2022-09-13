import { Button, useDisclosure } from '@chakra-ui/react';
import { EquipmentDTO } from 'generated-api';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { EquipmentAddForm } from './EquipmentAddForm';
import { EquipmentAddSuccess } from './EquipmentAddSuccess';
import { EquipmentTable } from './EquipmentTable';

export const Equipment = () => {
  const [refresh, setRefresh] = useState(false);
  const [newEquipmentDTO, setEquipmentDTO] = useState<EquipmentDTO | undefined>(
    undefined
  );

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

  const handleComplete = (newEquipment: EquipmentDTO) => {
    setEquipmentDTO(newEquipment);
    onClose();
    onSuccessOpen();
  };

  const handleRegisterAgain = () => {
    setEquipmentDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setEquipmentDTO(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  return (
    <MainLayout title='Equipment'>
      <ContentHeader
        title='Equipment'
        actions={
          <Button
            variant='solid'
            onClick={onAddOpen}
            data-cy='add-equipment-btn'
          >
            Add Equipment
          </Button>
        }
      />
      <ContentSection>
        <EquipmentTable refresh={refresh} />
      </ContentSection>

      <Modal title='Equipment Add' isOpen={isAddOpen} onClose={onClose}>
        <EquipmentAddForm onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose} size='xl'>
        <EquipmentAddSuccess
          equipment={newEquipmentDTO}
          onClose={handleSuccessClose}
          onRepeat={handleRegisterAgain}
        />
      </Modal>
    </MainLayout>
  );
};

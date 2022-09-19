import { Button, useDisclosure } from '@chakra-ui/react';
import { OrganizerDTO } from 'generated-api';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { OrganizerAddForm } from './OrganizerAddForm';
import { OrganizerAddSuccess } from './OrganizerAddSuccess';
import { OrganizersTable } from './OrganizersTable';

export const Organizers = () => {
  const [refresh, setRefresh] = useState(false);
  const [newOrganizerDTO, setOrganizerDTO] = useState<OrganizerDTO | undefined>(
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

  const handleComplete = (newOrganizer: OrganizerDTO) => {
    setOrganizerDTO(newOrganizer);
    onClose();
    onSuccessOpen();
  };

  const handleRegisterAgain = () => {
    setOrganizerDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setOrganizerDTO(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  return (
    <MainLayout title='Organizers'>
      <ContentHeader
        title='Organizers'
        actions={
          <Button
            variant='solid'
            onClick={onAddOpen}
            data-cy='add-organizer-btn'
          >
            Add Organizer
          </Button>
        }
      />

      <ContentSection>
        <OrganizersTable refresh={refresh} />
      </ContentSection>

      <Modal title='New Organizer' isOpen={isAddOpen} onClose={onClose}>
        <OrganizerAddForm onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <OrganizerAddSuccess
          organizer={newOrganizerDTO}
          onClose={handleSuccessClose}
          onConfirm={handleRegisterAgain}
        />
      </Modal>
    </MainLayout>
  );
};

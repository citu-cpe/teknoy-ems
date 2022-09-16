import { Button, useDisclosure } from '@chakra-ui/react';
import { VenueDTO } from 'generated-api';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { VenueAddForm } from './VenueAddForm';
import { VenueAddSuccess } from './VenueAddSuccess';
import { VenuesTable } from './VenuesTable';

export const Venues = () => {
  const [refresh, setRefresh] = useState(false);
  const [newVenueDTO, setVenueDTO] = useState<VenueDTO | undefined>(undefined);

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

  const handleComplete = (newVenue: VenueDTO) => {
    setVenueDTO(newVenue);
    onClose();
    onSuccessOpen();
  };

  const handleAddAgain = () => {
    setVenueDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setVenueDTO(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  return (
    <MainLayout title='Venues'>
      <ContentHeader
        title='Venue'
        actions={
          <Button variant='solid' onClick={onAddOpen} data-cy='add-venue-btn'>
            Add Venue
          </Button>
        }
      />
      <ContentSection>
        <VenuesTable refresh={refresh} />
      </ContentSection>

      <Modal title='New Venue' isOpen={isAddOpen} onClose={onClose}>
        <VenueAddForm onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <VenueAddSuccess
          venue={newVenueDTO}
          onClose={handleSuccessClose}
          onConfirm={handleAddAgain}
        />
      </Modal>
    </MainLayout>
  );
};

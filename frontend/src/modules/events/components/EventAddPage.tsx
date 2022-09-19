import { useDisclosure, Modal } from '@chakra-ui/react';
import { EventDTO } from 'generated-api';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { MainLayout } from '../../../shared/components/layout';
import { EventAddForm } from './EventAddForm';

export const EventAddPage = () => {
  const [newEventDTO, setEventDTO] = useState<EventDTO | undefined>(undefined);

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

  const handleComplete = (newEvent: EventDTO) => {
    setEventDTO(newEvent);
    onClose();
    onSuccessOpen();
  };

  const handleRegisterAgain = () => {
    setEventDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setEventDTO(undefined);
    onSuccessClose();
    // setRefresh(!refresh);
  };

  return (
    <MainLayout title='Reserve Event'>
      <ContentHeader title='Reserve Event' />
      <ContentSection>
        <EventAddForm onComplete={handleComplete} />
      </ContentSection>

      {/* <Modal title='New Event' isOpen={isAddOpen} onClose={onClose} size='2xl'>
        <EventAddForm onComplete={handleComplete} />
      </Modal> */}

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        {/* <EventAddSuccess
          organizer={newEventDTO}
          onClose={handleSuccessClose}
          onConfirm={handleRegisterAgain}
        /> */}
      </Modal>
    </MainLayout>
  );
};

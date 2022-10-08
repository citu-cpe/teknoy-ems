import { useDisclosure } from '@chakra-ui/react';
import { EventDTO } from 'generated-api';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { basicAuth } from '../../../shared/schemas';
import { EventAddForm } from './EventAddForm';
import { EventAddSuccess } from './EventAddSuccess';

export const EventAddPage = () => {
  const router = useRouter();

  const [newEventDTO, setEventDTO] = useState<EventDTO | undefined>(undefined);

  const eventAddKey = useRef(new Date().getTime());

  const {
    onOpen: onSuccessOpen,
    isOpen: isSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure();

  const handleComplete = (newEvent: EventDTO) => {
    setEventDTO(newEvent);
    onSuccessOpen();
  };

  const handleAddAgain = () => {
    setEventDTO(undefined);
    onSuccessClose();
    eventAddKey.current = new Date().getTime();
  };

  const handleSuccessClose = () => {
    setEventDTO(undefined);
    onSuccessClose();
    router.push('/events');
  };

  return (
    <MainLayout title='Reserve Event'>
      <ContentHeader title='Reserve Event' />
      <ContentSection>
        <EventAddForm key={eventAddKey.current} onComplete={handleComplete} />
      </ContentSection>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <EventAddSuccess
          event={newEventDTO}
          onClose={handleSuccessClose}
          onConfirm={handleAddAgain}
        />
      </Modal>
    </MainLayout>
  );
};

EventAddPage.auth = basicAuth;

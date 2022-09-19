import { Button, useDisclosure } from '@chakra-ui/react';
import { AnnouncementDTO } from 'generated-api';
import { useState } from 'react';
import {
  ContentHeader,
  ContentSection,
} from '../../../shared/components/content';
import { Modal } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { AnnouncementAddForm } from './AnnouncementAddForm';
import { AnnouncementAddSuccess } from './AnnouncementAddSuccess';
import { AnnouncementsTable } from './AnnouncementTable';

export const Announcements = () => {
  const [refresh, setRefresh] = useState(false);
  const [newAnnouncementDTO, setAnnouncementDTO] = useState<
    AnnouncementDTO | undefined
  >(undefined);

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

  const handleComplete = (newAnnouncement: AnnouncementDTO) => {
    setAnnouncementDTO(newAnnouncement);
    onClose();
    onSuccessOpen();
  };

  const handleAddAgain = () => {
    setAnnouncementDTO(undefined);
    onAddOpen();
    onSuccessClose();
  };

  const handleSuccessClose = () => {
    setAnnouncementDTO(undefined);
    onSuccessClose();
    setRefresh(!refresh);
  };

  return (
    <MainLayout title='Announcement'>
      <ContentHeader
        title='Announcements'
        actions={
          <Button
            variant='solid'
            onClick={onAddOpen}
            data-cy='add-announcement-btn'
          >
            Add Announcement
          </Button>
        }
      />
      <ContentSection>
        <AnnouncementsTable refresh={refresh} />
      </ContentSection>

      <Modal title='New Announcement' isOpen={isAddOpen} onClose={onClose}>
        <AnnouncementAddForm onComplete={handleComplete} />
      </Modal>

      <Modal isOpen={isSuccessOpen} onClose={handleSuccessClose}>
        <AnnouncementAddSuccess
          announcement={newAnnouncementDTO}
          onClose={handleSuccessClose}
          onConfirm={handleAddAgain}
        />
      </Modal>
    </MainLayout>
  );
};

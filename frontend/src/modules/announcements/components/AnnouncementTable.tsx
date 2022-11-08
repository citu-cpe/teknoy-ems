import {
  Center,
  Spinner,
  Table,
  TableContainer,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { AnnouncementDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { EllipsisText } from '../../../shared/components/elements/Text';
import { TableActions } from '../../../shared/components/table/TableActions';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { AnnouncementEditForm } from './AnnouncementEditForm';
import { AnnouncementView } from './AnnouncementView';

interface AnnouncementsTableProps {
  refresh: boolean;
}

export const AnnouncementsTable = ({ refresh }: AnnouncementsTableProps) => {
  const api = useContext(ApiContext);
  const toast = useToast();
  const socket = useContext(SocketContext);
  const [announcements, setAnnouncements] = useState<
    AnnouncementDTO[] | undefined
  >([]);
  const announcementToView = useRef<AnnouncementDTO | null>(null);
  const announcementToEdit = useRef<AnnouncementDTO | null>(null);
  const announcementToDelete = useRef<AnnouncementDTO | null>(null);

  const {
    onOpen: onViewModalOpen,
    isOpen: isViewModalOpen,
    onClose: onViewModalClose,
  } = useDisclosure();

  const {
    onOpen: onEditModalOpen,
    isOpen: isEditModalOpen,
    onClose: onEditModalClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteDialogOpen,
    onOpen: onDeleteDialogOpen,
    onClose: onDeleteDialogClose,
  } = useDisclosure();

  const fetchAnnouncement = useMutation(() => api.getAnnouncements(), {
    onSuccess: (data) => {
      setAnnouncements(() => data.data);
    },
  });

  const deleteAnnouncement = useMutation(
    (announcementDTO: AnnouncementDTO) =>
      api.deleteAnnouncement(announcementDTO.id as string),
    {
      onSuccess: () => {
        fetchAllAnnouncement();
      },
    }
  );

  const fetchAllAnnouncement = () => {
    fetchAnnouncement.mutate();
  };

  useEffect(() => {
    fetchAllAnnouncement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleView = (announcementDTO: AnnouncementDTO) => {
    onViewModalOpen();
    announcementToView.current = announcementDTO;
  };

  const handleEdit = (announcementDTO: AnnouncementDTO) => {
    onEditModalOpen();
    announcementToEdit.current = announcementDTO;
  };

  const handleDelete = (announcementDTO: AnnouncementDTO) => {
    onDeleteDialogOpen();
    announcementToDelete.current = announcementDTO;
  };

  const handleDeleteConfirm = async () => {
    const announcementDTO = announcementToDelete.current;

    if (announcementDTO === null) {
      return;
    }

    await deleteAnnouncement.mutateAsync(announcementDTO);
    socket?.emit(WebSocketEnum.UPDATE_TABLES, 'ANNOUNCEMENT');
    toast({ title: 'Deleted announcement successfully' });
    onDeleteDialogClose();
  };

  const handleEditComplete = () => {
    fetchAllAnnouncement();
    onEditModalClose();
  };

  if (fetchAnnouncement.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <TableContainer position='relative' bg='foreground' p={0} m={0}>
      {announcementToView.current && (
        <Modal
          title='Announcement View'
          isOpen={isViewModalOpen}
          onClose={onViewModalClose}
        >
          <AnnouncementView announcement={announcementToView.current} />
        </Modal>
      )}

      {announcementToEdit.current && (
        <Modal
          title='Announcement Edit'
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
        >
          <AnnouncementEditForm
            initialAnnouncement={announcementToEdit.current}
            onComplete={handleEditComplete}
          />
        </Modal>
      )}

      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={''}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
      />
      <Table colorScheme='gray' fontSize='sm' variant='simple' p={0} m={0}>
        <Thead>
          <Tr>
            <Th>
              <Text as='span'>Title</Text>
            </Th>
            <Th>
              <Text as='span'>Subitle</Text>
            </Th>
            <Th>
              <Text as='span'>Content</Text>
            </Th>
            <Th>
              <Text as='span'>Tags</Text>
            </Th>
            <Th>
              <Text as='span'>View Access</Text>
            </Th>
            {/* Need the empty table data for Actions spacer */}
            <Th maxW={10} w={10}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {announcements &&
            announcements.map((an) => (
              <>
                <Center h={14} position='absolute' right={0}>
                  <TableActions
                    data={an}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Center>
                <Tr
                  key={an.id}
                  data-cy='announcement-row'
                  _hover={{ bg: 'hoverBg', cursor: 'pointer' }}
                  transition={'all 0.1s linear'}
                  onClick={() => handleView(an)}
                >
                  <Td maxW={32}>
                    <EllipsisText
                      fontWeight='medium'
                      opacity={0.8}
                      data-cy='announcement-title'
                    >
                      {an.title}
                    </EllipsisText>
                  </Td>
                  <Td maxW={32}>
                    <EllipsisText opacity={0.8} data-cy='announcement-subtitle'>
                      {an.subtitle}
                    </EllipsisText>
                  </Td>
                  <Td maxW={32}>
                    <EllipsisText opacity={0.8} data-cy='announcement-content'>
                      {an.content}
                    </EllipsisText>
                  </Td>
                  <Td maxW={32}>
                    <EllipsisText opacity={0.8} data-cy='announcement-tags'>
                      {an.tags.map((tg, index) => (
                        <Tag
                          key={index}
                          colorScheme='gray'
                          mr={1}
                          data-cy='tags-single'
                        >
                          {tg.toString()}
                        </Tag>
                      ))}
                    </EllipsisText>
                  </Td>
                  <Td maxW={32}>
                    <EllipsisText
                      opacity={0.8}
                      data-cy='announcement-view-access'
                    >
                      {an.viewAccess}
                    </EllipsisText>
                  </Td>
                  <Td>{/* Need the empty table data for Actions spacer */}</Td>
                </Tr>
              </>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

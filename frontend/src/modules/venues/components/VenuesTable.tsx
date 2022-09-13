import {
  Center,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { VenueDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { EllipsisText } from '../../../shared/components/elements/Text';
import { TableActions } from '../../../shared/components/table/TableActions';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { VenueEditForm } from './VenueEditForm';
import { VenueView } from './VenueView';

interface VenuesTableProps {
  refresh: boolean;
}

export const VenuesTable = ({ refresh }: VenuesTableProps) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const [venues, setVenues] = useState<VenueDTO[] | undefined>([]);
  const venueToView = useRef<VenueDTO | null>(null);
  const venueToEdit = useRef<VenueDTO | null>(null);
  const venueToDelete = useRef<VenueDTO | null>(null);

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

  const fetchVenue = useMutation(() => api.getVenues(), {
    onSuccess: (data) => {
      setVenues(() => data.data);
    },
  });

  const deleteVenue = useMutation(
    (venueDTO: VenueDTO) => api.deleteVenue(venueDTO.id as string),
    {
      onSuccess: () => {
        fetchAllVenue();
      },
    }
  );

  const fetchAllVenue = () => {
    fetchVenue.mutate();
  };

  useEffect(() => {
    fetchAllVenue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleView = (venueDTO: VenueDTO) => {
    onViewModalOpen();
    venueToView.current = venueDTO;
  };

  const handleEdit = (venueDTO: VenueDTO) => {
    onEditModalOpen();
    venueToEdit.current = venueDTO;
  };

  const handleDelete = (venueDTO: VenueDTO) => {
    onDeleteDialogOpen();
    venueToDelete.current = venueDTO;
  };

  const handleDeleteConfirm = async () => {
    const venueDTO = venueToDelete.current;

    if (venueDTO === null) {
      return;
    }

    await deleteVenue.mutateAsync(venueDTO);
    toast({ title: 'Deleted venue successfully' });
    onDeleteDialogClose();
  };

  const handleEditComplete = () => {
    fetchAllVenue();
    onEditModalClose();
  };

  if (fetchVenue.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <TableContainer position='relative' bg='foreground' p={0} m={0}>
      {venueToView.current && (
        <Modal
          title='Venue View'
          isOpen={isViewModalOpen}
          onClose={onViewModalClose}
        >
          <VenueView venue={venueToView.current} />
        </Modal>
      )}

      {venueToEdit.current && (
        <Modal
          title='Venue Edit'
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
        >
          <VenueEditForm
            initialVenue={venueToEdit.current}
            onComplete={handleEditComplete}
          />
        </Modal>
      )}

      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={venueToDelete.current?.name.toString()}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
      />
      <Table colorScheme='gray' fontSize='sm' variant='simple' p={0} m={0}>
        <Thead>
          <Tr>
            <Th>
              <Text as='span'>Name</Text>
            </Th>
            <Th>
              <Text as='span'>Notes</Text>
            </Th>
            <Th textAlign='center'>
              <Text as='span'>Schedules</Text>
            </Th>
            {/* Need the empty table data for Actions spacer */}
            <Th maxW={10} w={10}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {venues &&
            venues.map((vn) => (
              <>
                <Center h={14} position='absolute' right={0}>
                  <TableActions
                    data={vn}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Center>
                <Tr
                  key={vn.id}
                  data-cy='venue-row'
                  _hover={{ bg: 'hoverBg', cursor: 'pointer' }}
                  transition={'all 0.1s linear'}
                  onClick={() => handleView(vn)}
                >
                  <Td maxW={32}>
                    <EllipsisText fontWeight='medium' data-cy='venue-name'>
                      {vn.name}
                    </EllipsisText>
                  </Td>
                  <Td maxW={48}>
                    <EllipsisText opacity={0.8} data-cy='venue-notes'>
                      {vn.notes}
                    </EllipsisText>
                  </Td>
                  <Td maxW={10} textAlign='center'>
                    <Text>{vn.schedule?.length.toString()}</Text>
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

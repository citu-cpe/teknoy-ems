import {
  Avatar,
  Center,
  Flex,
  Icon,
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
import { OrganizerDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaBuilding, FaUserAlt } from 'react-icons/fa';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { TableActions } from '../../../shared/components/table/TableActions';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { OrganizerEditForm } from './OrganizerEditForm';

interface OrganizersTableProps {
  refresh: boolean;
}

export const OrganizersTable = ({ refresh }: OrganizersTableProps) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const [organizers, setOrganizers] = useState<OrganizerDTO[] | undefined>([]);
  const organizerToEdit = useRef<OrganizerDTO | null>(null);
  const organizerToDelete = useRef<OrganizerDTO | null>(null);

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

  const fetchOrganizers = useMutation(() => api.getAllOrganizers(), {
    onSuccess: (data) => {
      setOrganizers(() => data.data);
    },
  });

  const deleteOrganizers = useMutation(
    (organizerDTO: OrganizerDTO) =>
      api.deleteOrganizer(organizerDTO.id as string),
    {
      onSuccess: () => {
        fetchAllOrganizers();
      },
    }
  );

  const fetchAllOrganizers = () => {
    fetchOrganizers.mutate();
  };

  useEffect(() => {
    fetchAllOrganizers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleEdit = (organizerDTO: OrganizerDTO) => {
    onEditModalOpen();
    organizerToEdit.current = organizerDTO;
  };

  const handleDelete = (organizerDTO: OrganizerDTO) => {
    onDeleteDialogOpen();
    organizerToDelete.current = organizerDTO;
  };

  const handleDeleteConfirm = async () => {
    const organizerDTO = organizerToDelete.current;

    if (organizerDTO === null) {
      return;
    }

    await deleteOrganizers.mutateAsync(organizerDTO);
    toast({ title: 'Deleted organizer successfully' });
    onDeleteDialogClose();
  };

  const handleEditComplete = () => {
    fetchAllOrganizers();
    onEditModalClose();
  };

  if (fetchOrganizers.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <TableContainer bg='foreground' p={0} m={0}>
      {organizerToEdit.current && (
        <Modal
          title='Organizer Edit'
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
        >
          <OrganizerEditForm
            initialOrganizer={organizerToEdit.current}
            onComplete={handleEditComplete}
          />
        </Modal>
      )}

      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={organizerToDelete.current?.name.toString()}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
      />
      <Table colorScheme='gray' variant='simple' p={0} m={0}>
        <Thead>
          <Tr>
            <Th>
              <Icon as={FaUserAlt} mr={2} />
              <Text fontSize='sm' as='span'>
                Name
              </Text>
            </Th>
            <Th>
              <Icon as={FaBuilding} mr={2} />
              <Text fontSize='sm' as='span'>
                Type
              </Text>
            </Th>
            <Th maxW={10} w={10}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {organizers &&
            organizers.map((org) => (
              <Tr key={org.id} w={10} maxW={10} data-cy='organizer-row'>
                <Td>
                  <Flex gap={2} alignItems='center'>
                    <Avatar name={org.name} src='#' />
                    <Text as='span' data-cy='organizer-name'>
                      {org.name}
                    </Text>
                  </Flex>
                </Td>
                <Td>
                  <Text
                    as='span'
                    fontSize='sm'
                    opacity={0.8}
                    data-cy='organizer-type'
                  >
                    {org.type}
                  </Text>
                </Td>
                <Td>
                  <TableActions
                    data={org}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

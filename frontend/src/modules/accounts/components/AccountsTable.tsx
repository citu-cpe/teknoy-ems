import {
  Avatar,
  Center,
  Flex,
  HStack,
  Icon,
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
import { UserDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { TableActions } from '../../../shared/components/table';
import { WebSocketEnum } from '../../../shared/enums/webSocketEnum';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { SocketContext } from '../../../shared/providers/SocketProvider';
import { useGlobalStore } from '../../../shared/stores';
import { AccountEditForm } from './AccountEditForm';

interface AccountsTableProps {
  refresh: boolean;
}

export const AccountsTable = ({ refresh }: AccountsTableProps) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const { getUser } = useGlobalStore();
  const localUser = getUser();
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState<UserDTO[] | undefined>([]);
  const userToEdit = useRef<UserDTO | null>(null);
  const userToDelete = useRef<UserDTO | null>(null);

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

  const fetchUsers = useMutation(() => api.getUsers(), {
    onSuccess: (data) => {
      setUsers(() => data.data);
    },
  });

  const deleteUser = useMutation(
    (userDTO: UserDTO) => api.deleteUser(userDTO.id),
    {
      onSuccess: () => {
        fetchAllUsers();
      },
    }
  );

  const fetchAllUsers = () => {
    fetchUsers.mutate();
  };

  useEffect(() => {
    fetchAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleEdit = (userDTO: UserDTO) => {
    onEditModalOpen();
    userToEdit.current = userDTO;
  };

  const handleDelete = (userDTO: UserDTO) => {
    onDeleteDialogOpen();
    userToDelete.current = userDTO;
  };

  const handleDeleteConfirm = async () => {
    const userDTO = userToDelete.current;

    if (userDTO === null) {
      return;
    }

    if (localUser?.id.toString() === userDTO.id.toString()) {
      toast({
        title: 'Error',
        description: 'Cannot delete own account in Accounts',
        status: 'error',
      });
    } else {
      await deleteUser.mutateAsync(userDTO);
      socket?.emit(WebSocketEnum.UPDATE_TABLES, 'ACCOUNT');
    }

    toast({ title: 'Deleted account successfully' });
    onDeleteDialogClose();
  };

  const handleEditComplete = () => {
    fetchAllUsers();
    onEditModalClose();
  };

  if (fetchUsers.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <TableContainer bg='foreground' p={0} m={0}>
      {userToEdit.current && (
        <Modal
          title='Account Edit'
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
        >
          <AccountEditForm
            initialUser={userToEdit.current}
            onComplete={handleEditComplete}
          />
        </Modal>
      )}

      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={userToDelete.current?.name.toString()}
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
              <Icon as={FaLock} mr={2} />
              <Text fontSize='sm' as='span'>
                Roles
              </Text>
            </Th>
            <Th maxW={10} w={10}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {users &&
            users.map((user) => (
              <Tr key={user.id} w={10} maxW={10} data-cy='user-row'>
                <Td>
                  <Flex gap={2} alignItems='center'>
                    <Avatar name={user.name} src='#' />
                    <Flex direction='column'>
                      <Text as='span' data-cy='user-name'>
                        {user.name}
                      </Text>
                      <Text
                        as='span'
                        fontSize='sm'
                        opacity={0.8}
                        data-cy='user-email'
                      >
                        {user.email}
                      </Text>
                    </Flex>
                  </Flex>
                </Td>
                <Td>
                  <HStack>
                    {user.roles.map((role, index) => (
                      <Tag colorScheme='gray' key={index} data-cy='roles-tag'>
                        {role.toString()}
                      </Tag>
                    ))}
                  </HStack>
                </Td>
                <Td>
                  <TableActions
                    data={user}
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

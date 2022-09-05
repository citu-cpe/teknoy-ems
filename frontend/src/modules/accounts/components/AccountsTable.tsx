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
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { FaLock, FaUserAlt } from 'react-icons/fa';
import { useMutation } from 'react-query';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { useGlobalStore } from '../../../shared/stores';
import { AccountActions } from './AccountActions';

export const AccountsTable = () => {
  const api = useContext(ApiContext);
  const router = useRouter();
  const toast = useToast();

  const { getUser } = useGlobalStore();
  const localUser = getUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<UserDTO[] | undefined>([]);
  const userToDelete = useRef<UserDTO | null>(null);

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
  }, []);

  const handleEdit = (userDTO: UserDTO) => {
    router.push(`/accounts/edit/${userDTO.id}`);
  };

  const handleDelete = (userDTO: UserDTO) => {
    onOpen();
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
    }

    onClose();
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
      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={userToDelete.current?.name.toString()}
        isOpen={isOpen}
        onClose={onClose}
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
              <Tr key={user.id} w={10} maxW={10}>
                <Td>
                  <Flex gap={2} alignItems='center'>
                    <Avatar name={user.name} src='#' />
                    <Flex direction='column'>
                      <Text as='span'>{user.name}</Text>
                      <Text as='span' fontSize='sm' opacity={0.8}>
                        {user.email}
                      </Text>
                    </Flex>
                  </Flex>
                </Td>
                <Td>
                  <HStack>
                    {user.roles.map((role, index) => (
                      <Tag colorScheme='gray' key={index}>
                        {role.toString()}
                      </Tag>
                    ))}
                  </HStack>
                </Td>
                <Td>
                  <AccountActions
                    user={user}
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

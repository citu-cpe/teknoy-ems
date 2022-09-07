import {
  Button,
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
import { EquipmentDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { BiCalendar } from 'react-icons/bi';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { TableActions } from '../../../shared/components/table/TableActions';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { EquipmentEditForm } from './EquipmentEditForm';

interface EquipmentTableProps {
  refresh: boolean;
}

export const EquipmentTable = ({ refresh }: EquipmentTableProps) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const [equipment, setEquipment] = useState<EquipmentDTO[] | undefined>([]);
  const equipmentToEdit = useRef<EquipmentDTO | null>(null);
  const equipmentToDelete = useRef<EquipmentDTO | null>(null);

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

  const fetchEquipment = useMutation(() => api.getAllEquipments(), {
    onSuccess: (data) => {
      setEquipment(() => data.data);
    },
  });

  const deleteEquipment = useMutation(
    (equipmentDTO: EquipmentDTO) =>
      api.deleteEquipment(equipmentDTO.id as string),
    {
      onSuccess: () => {
        fetchAllEquipment();
      },
    }
  );

  const fetchAllEquipment = () => {
    fetchEquipment.mutate();
  };

  useEffect(() => {
    fetchAllEquipment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  const handleEdit = (equipmentDTO: EquipmentDTO) => {
    onEditModalOpen();
    equipmentToEdit.current = equipmentDTO;
  };

  const handleDelete = (equipmentDTO: EquipmentDTO) => {
    onDeleteDialogOpen();
    equipmentToDelete.current = equipmentDTO;
  };

  const handleDeleteConfirm = async () => {
    const equipmentDTO = equipmentToDelete.current;

    if (equipmentDTO === null) {
      return;
    }

    await deleteEquipment.mutateAsync(equipmentDTO);
    toast({ title: 'Deleted equipment successfully' });
    onDeleteDialogClose();
  };

  const handleEditComplete = () => {
    fetchAllEquipment();
    onEditModalClose();
  };

  if (fetchEquipment.isLoading) {
    return (
      <Center minH={80} minW={80}>
        <Spinner colorScheme='brand' />
      </Center>
    );
  }

  return (
    <TableContainer position='relative' bg='foreground' p={0} m={0}>
      {equipmentToEdit.current && (
        <Modal
          title='Equipment Edit'
          isOpen={isEditModalOpen}
          onClose={onEditModalClose}
        >
          <EquipmentEditForm
            initialEquipment={equipmentToEdit.current}
            onComplete={handleEditComplete}
          />
        </Modal>
      )}

      <Dialog
        title='Delete'
        description='Proceeding with this action cannot be undone. Continue?'
        data={equipmentToDelete.current?.name.toString()}
        isOpen={isDeleteDialogOpen}
        onClose={onDeleteDialogClose}
        onConfirm={handleDeleteConfirm}
      />
      <Table colorScheme='gray' fontSize='sm' variant='simple' p={0} m={0}>
        <Thead>
          <Tr>
            <Th>
              {/* <Icon as={FaUserAlt} mr={2} /> */}
              <Text as='span'>Name</Text>
            </Th>
            <Th>
              {/* <Icon as={FaTable} mr={2} /> */}
              <Text as='span'>Type</Text>
            </Th>
            <Th>
              {/* <Icon as={FaBuilding} mr={2} /> */}
              <Text as='span'>Brand</Text>
            </Th>
            <Th>
              {/* <Icon as={FaBuilding} mr={2} /> */}
              <Text as='span'>Serial</Text>
            </Th>
            <Th>
              {/* <Icon as={FaBuilding} mr={2} /> */}
              <Text as='span'>Notes</Text>
            </Th>
            <Th maxW={10} w={10}></Th>
          </Tr>
        </Thead>
        <Tbody>
          {equipment &&
            equipment.map((eq) => (
              <Tr key={eq.id} w={10} maxW={10} data-cy='equipment-row'>
                <Td>
                  <Flex gap={2} alignItems='center'>
                    <Text
                      as='span'
                      fontWeight='medium'
                      data-cy='equipment-name'
                    >
                      {eq.name}
                    </Text>
                  </Flex>
                </Td>
                <Td>
                  <Text as='span' opacity={0.8} data-cy='equipment-type'>
                    {eq.type}
                  </Text>
                </Td>
                <Td>
                  <Text as='span' opacity={0.8} data-cy='equipment-brand'>
                    {eq.brand}
                  </Text>
                </Td>
                <Td>
                  <Text as='span' opacity={0.8} data-cy='equipment-serial'>
                    {eq.serial}
                  </Text>
                </Td>
                <Td>
                  <Text as='span' opacity={0.8} data-cy='equipment-notes'>
                    {eq.notes}
                  </Text>
                </Td>
                <Td>
                  <Button
                    leftIcon={<Icon as={BiCalendar} />}
                    size='sm'
                    data-cy='schedule-btn'
                  >
                    Schedules
                  </Button>
                </Td>
                <Td>
                  <TableActions
                    data={eq}
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

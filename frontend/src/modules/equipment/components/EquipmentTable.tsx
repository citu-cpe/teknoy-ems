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
import { EquipmentDTO } from 'generated-api';
import { useContext, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { Modal } from '../../../shared/components/elements';
import { Dialog } from '../../../shared/components/elements/Dialog/Dialog';
import { EllipsisText } from '../../../shared/components/elements/Text';
import { TableActions } from '../../../shared/components/table/TableActions';
import { enumValueToCapitalCase } from '../../../shared/helpers/enum-helpers';
import { useToast } from '../../../shared/hooks';
import { ApiContext } from '../../../shared/providers/ApiProvider';
import { EquipmentEditForm } from './EquipmentEditForm';
import { EquipmentView } from './EquipmentView';

interface EquipmentTableProps {
  refresh: boolean;
}

export const EquipmentTable = ({ refresh }: EquipmentTableProps) => {
  const api = useContext(ApiContext);
  const toast = useToast();

  const [equipment, setEquipment] = useState<EquipmentDTO[] | undefined>([]);
  const equipmentToView = useRef<EquipmentDTO | null>(null);
  const equipmentToEdit = useRef<EquipmentDTO | null>(null);
  const equipmentToDelete = useRef<EquipmentDTO | null>(null);

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

  const handleView = (equipmentDTO: EquipmentDTO) => {
    onViewModalOpen();
    equipmentToView.current = equipmentDTO;
  };

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
      {equipmentToView.current && (
        <Modal
          title='Equipment View'
          isOpen={isViewModalOpen}
          onClose={onViewModalClose}
        >
          <EquipmentView equipment={equipmentToView.current} />
        </Modal>
      )}

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
              <Text as='span'>Name</Text>
            </Th>
            <Th>
              <Text as='span'>Type</Text>
            </Th>
            <Th>
              <Text as='span'>Brand</Text>
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
          {equipment &&
            equipment.map((eq) => (
              <>
                <Center h={14} position='absolute' right={0}>
                  <TableActions
                    data={eq}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Center>
                <Tr
                  key={eq.id}
                  data-cy='equipment-row'
                  _hover={{ bg: 'hoverBg', cursor: 'pointer' }}
                  transition={'all 0.1s linear'}
                  onClick={() => handleView(eq)}
                >
                  <Td maxW={32}>
                    <EllipsisText fontWeight='medium' data-cy='equipment-name'>
                      {eq.name}
                    </EllipsisText>
                  </Td>
                  <Td maxW={32}>
                    <EllipsisText opacity={0.8} data-cy='equipment-type'>
                      {enumValueToCapitalCase(eq.type)}
                    </EllipsisText>
                  </Td>
                  <Td maxW={32}>
                    <EllipsisText opacity={0.8} data-cy='equipment-brand'>
                      {eq.brand}
                    </EllipsisText>
                  </Td>
                  <Td maxW={48}>
                    <EllipsisText opacity={0.8} data-cy='equipment-notes'>
                      {eq.notes}
                    </EllipsisText>
                  </Td>
                  <Td maxW={10} textAlign='center'>
                    <Text>{eq.schedules?.length.toString()}</Text>
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

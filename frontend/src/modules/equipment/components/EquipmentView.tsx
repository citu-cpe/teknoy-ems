import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { EquipmentDTO } from 'generated-api';
import moment from 'moment';

interface EquipmentViewProps {
  equipment: EquipmentDTO;
}

export const EquipmentView = ({ equipment }: EquipmentViewProps) => {
  return (
    <Flex direction='column' gap={2}>
      <Text as='h2' fontWeight='bold'>
        Information
      </Text>

      <TableContainer>
        <Table size='sm' w='full' maxW='full'>
          <Tbody w='full' maxW='full'>
            <Tr>
              <Th>Name</Th>
              <Td>{equipment.name}</Td>
            </Tr>
            <Tr>
              <Th>Type</Th>
              <Td>{equipment.type}</Td>
            </Tr>
            <Tr>
              <Th>Brand</Th>
              <Td>{equipment.brand}</Td>
            </Tr>
            <Tr>
              <Th>Serial</Th>
              <Td>{equipment.serial}</Td>
            </Tr>
            <Tr>
              <Th>Notes</Th>
              <Td>
                <Textarea variant='flushed' w='full' fontSize='sm' readOnly>
                  {equipment.notes}
                </Textarea>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Text as='h2' fontWeight='bold' mt={3}>
        Schedules
      </Text>

      {equipment.schedules && equipment.schedules?.length <= 0 ? (
        <Text textAlign='center' mt={6} mb={6}>
          No reserved schedules for this equipment.
        </Text>
      ) : (
        <Flex direction='column'>
          <TableContainer>
            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Start Time</Th>
                  <Th>End Time</Th>
                  <Th>Availability</Th>
                </Tr>
              </Thead>
              <Tbody>
                {equipment.schedules?.map((schedule) => (
                  <Tr key={schedule.id}>
                    <Td>
                      {moment(schedule.startTime).format('MMMM DD, YYYY')}
                    </Td>
                    <Td>{moment(schedule.startTime).format('h:mm A')}</Td>
                    <Td>{moment(schedule.endTime).format('h:mm A')}</Td>
                    <Td>{schedule.availability}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      )}
    </Flex>
  );
};

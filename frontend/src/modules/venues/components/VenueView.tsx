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
import { VenueDTO } from 'generated-api';
import moment from 'moment';

interface VenueViewProps {
  venue: VenueDTO;
}

export const VenueView = ({ venue }: VenueViewProps) => {
  return (
    <Flex direction='column' gap={2}>
      <Text as='h2' fontWeight='bold' mb={2}>
        Information
      </Text>

      <TableContainer>
        <Table
          colorScheme='gray'
          fontSize='sm'
          variant='simple'
          size='sm'
          w='full'
          maxW='full'
        >
          <Tbody w='full' maxW='full'>
            <Tr>
              <Th>Name</Th>
              <Td>
                <Text data-cy='venue-view-name'>{venue.name}</Text>
              </Td>
            </Tr>
            <Tr>
              <Th>Notes</Th>
              <Td>
                <Textarea
                  data-cy='venue-view-notes'
                  variant='flushed'
                  w='full'
                  fontSize='sm'
                  readOnly
                >
                  {venue.notes}
                </Textarea>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>

      <Text as='h2' fontWeight='bold' mt={3}>
        Schedules
      </Text>

      {venue.schedule && venue.schedule?.length <= 0 ? (
        <Text textAlign='center' fontSize='sm' opacity={0.5} mt={6} mb={6}>
          No reserved schedules for this venue.
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
                {venue.schedule?.map((sch) => (
                  <Tr key={sch.id}>
                    <Td>{moment(sch.startTime).format('MMMM DD, YYYY')}</Td>
                    <Td>{moment(sch.startTime).format('h:mm A')}</Td>
                    <Td>{moment(sch.endTime).format('h:mm A')}</Td>
                    <Td>{sch.availability}</Td>
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

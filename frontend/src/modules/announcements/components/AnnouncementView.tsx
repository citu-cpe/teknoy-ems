import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Tr,
} from '@chakra-ui/react';
import { AnnouncementDTO } from 'generated-api';

interface AnnouncementViewProps {
  announcement: AnnouncementDTO;
}

export const AnnouncementView = ({ announcement }: AnnouncementViewProps) => {
  return (
    <Flex direction='column' gap={2}>
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
              <Th>Title</Th>
              <Td>{announcement.title}</Td>
            </Tr>

            {announcement.subtitle && (
              <Tr>
                <Th>Subtitle</Th>
                <Td>{announcement.subtitle}</Td>
              </Tr>
            )}

            <Tr>
              <Th>Content</Th>
              <Td>
                <Textarea variant='flushed' w='full' fontSize='sm' readOnly>
                  {announcement.content}
                </Textarea>
              </Td>
            </Tr>
            <Tr>
              <Th>Tags</Th>
              <Td>{announcement.tags.join(', ')}</Td>
            </Tr>
            <Tr>
              <Th>View Access</Th>
              <Td>{announcement.viewAccess}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

import {
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
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
              <Td>
                <Text data-cy='announcement-view-title'>
                  {announcement.title}
                </Text>
              </Td>
            </Tr>

            {announcement.subtitle && (
              <Tr>
                <Th>Subtitle</Th>
                <Td>
                  <Text data-cy='announcement-view-subtitle'>
                    {announcement.subtitle}
                  </Text>
                </Td>
              </Tr>
            )}

            <Tr>
              <Th>Content</Th>
              <Td>
                <Textarea
                  variant='flushed'
                  w='full'
                  fontSize='sm'
                  readOnly
                  data-cy='announcement-view-content'
                >
                  {announcement.content}
                </Textarea>
              </Td>
            </Tr>
            <Tr>
              <Th>Tags</Th>
              <Td>
                <Text data-cy='announcement-view-tags'>
                  {announcement.tags.join(', ')}
                </Text>
              </Td>
            </Tr>
            <Tr>
              <Th>View Access</Th>
              <Td>
                <Text data-cy='announcement-view-view-access'>
                  {announcement.viewAccess}
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
};

import { Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { AnnouncementDTO } from 'generated-api';
import { BiCheck } from 'react-icons/bi';
import { FormLayout } from '../../../shared/components/form';

interface AnnouncementAddSuccessProps {
  announcement: AnnouncementDTO | undefined;
  onClose: () => void;
  onRepeat: () => void;
}

export const AnnouncementAddSuccess = ({
  announcement,
  onClose,
  onRepeat,
}: AnnouncementAddSuccessProps) => {
  return (
    <>
      <FormLayout opacity={0.8} px={12}>
        <Flex direction='column' alignItems='center' justifyContent='center'>
          <Icon
            as={BiCheck}
            boxSize='3.5rem'
            color='green.500'
            bg='green.100'
            rounded='full'
            p={1}
            mb={4}
          />
          <Heading size='md' mb={4}>
            Announcement has been added
          </Heading>
          <Text fontWeight='bold'>Title</Text>
          <Text mb={2}>{announcement?.title}</Text>
          <Text fontWeight='bold'>Subtitle</Text>
          <Text mb={2}>{announcement?.subtitle}</Text>
          <Text fontWeight='bold'>Content</Text>
          <Text mb={2}>{announcement?.content}</Text>
          <Text fontWeight='bold'>Tags</Text>
          <Text mb={2}>{announcement?.tags.join(', ')}</Text>
          <Text fontWeight='bold'>View Access</Text>
          <Text mb={2}>{announcement?.viewAccess}</Text>
        </Flex>
      </FormLayout>
      <Flex alignItems='center' justifyContent='center'>
        <Button minW={48} onClick={onClose} data-cy='close-btn'>
          Close
        </Button>
        <Button minW={48} variant='solid' onClick={onRepeat} ml={2}>
          Add Again
        </Button>
      </Flex>
    </>
  );
};

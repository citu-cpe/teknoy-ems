import { Button, Flex, Icon, Spacer, Text } from '@chakra-ui/react';
import { OrganizerDTO } from 'generated-api';
import { BiCheckCircle } from 'react-icons/bi';
import { FormLayout } from '../../../shared/components/form';

interface OrganizerAddSuccessProps {
  organizerDTO: OrganizerDTO | undefined;
  onClose: () => void;
  onRepeat: () => void;
}

export const OrganizerAddSuccess = ({
  organizerDTO,
  onClose,
  onRepeat,
}: OrganizerAddSuccessProps) => {
  return (
    <>
      <FormLayout>
        <Flex direction='column' gap={3}>
          <Icon as={BiCheckCircle} boxSize='2rem' color='green.500' />
          <Text>Name: {organizerDTO?.name}</Text>
          <Text>Type: {organizerDTO?.type}</Text>
        </Flex>
      </FormLayout>
      <Flex>
        <Spacer />
        <Button onClick={onClose}>Close</Button>
        <Button variant='solid' onClick={onRepeat} ml={2}>
          Add Again
        </Button>
      </Flex>
    </>
  );
};

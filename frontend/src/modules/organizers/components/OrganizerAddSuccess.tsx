import { Button, Flex, Icon, Spacer } from '@chakra-ui/react';
import { OrganizerDTO } from 'generated-api';
import { BiCheckCircle } from 'react-icons/bi';
import { EllipsisText } from '../../../shared/components/elements/Text';
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
          <EllipsisText>Name: {organizerDTO?.name}</EllipsisText>
          <EllipsisText>Type: {organizerDTO?.type}</EllipsisText>
        </Flex>
      </FormLayout>
      <Flex>
        <Spacer />
        <Button onClick={onClose} data-cy='close-btn'>
          Close
        </Button>
        <Button variant='solid' onClick={onRepeat} ml={2}>
          Add Again
        </Button>
      </Flex>
    </>
  );
};

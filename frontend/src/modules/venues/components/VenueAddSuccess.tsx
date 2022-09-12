import { Button, Flex, Heading, Icon, Text } from '@chakra-ui/react';
import { VenueDTO } from 'generated-api';
import { BiCheck } from 'react-icons/bi';
import { FormLayout } from '../../../shared/components/form';

interface VenueAddSuccessProps {
  venue: VenueDTO | undefined;
  onClose: () => void;
  onRepeat: () => void;
}

export const VenueAddSuccess = ({
  venue,
  onClose,
  onRepeat,
}: VenueAddSuccessProps) => {
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
            Venue has been added
          </Heading>
          <Text fontWeight='bold'>Name</Text>
          <Text mb={2}>{venue?.name}</Text>
          <Text fontWeight='bold'>Notes</Text>
          <Text mb={2} w='full'>
            {venue?.notes}
          </Text>
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

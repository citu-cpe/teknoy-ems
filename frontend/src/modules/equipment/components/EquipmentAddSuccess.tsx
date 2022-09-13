import {
  Button,
  Flex,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Tr,
} from '@chakra-ui/react';
import { EquipmentDTO } from 'generated-api';
import { BiCheck } from 'react-icons/bi';
import { FormLayout } from '../../../shared/components/form';

interface EquipmentAddSuccessProps {
  equipment: EquipmentDTO | undefined;
  onClose: () => void;
  onRepeat: () => void;
}

export const EquipmentAddSuccess = ({
  equipment,
  onClose,
  onRepeat,
}: EquipmentAddSuccessProps) => {
  return (
    <>
      {/* <FormLayout opacity={0.8} px={12}>
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
            Equipment has been added
          </Heading>
          <Text fontWeight='bold'>Name</Text>
          <Text mb={2}>{equipment?.name}</Text>
          <Text fontWeight='bold'>Type</Text>
          <Text mb={2}>{equipment?.type}</Text>
          <Text fontWeight='bold'>Brand</Text>
          <Text mb={2}>{equipment?.brand}</Text>
          <Text fontWeight='bold'>Serial</Text>
          <Text mb={2}>{equipment?.serial}</Text>
          <Text fontWeight='bold'>Notes</Text>
          <Text mb={2} w='full'>
            {equipment?.notes}
          </Text>
        </Flex>
      </FormLayout> */}
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
          Equipment has been added
        </Heading>
      </Flex>

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
              <Td>{equipment?.name}</Td>
            </Tr>
            <Tr>
              <Th>Type</Th>
              <Td>{equipment?.type}</Td>
            </Tr>
            <Tr>
              <Th>Brand</Th>
              <Td>{equipment?.brand}</Td>
            </Tr>
            <Tr>
              <Th>Serial</Th>
              <Td>{equipment?.serial}</Td>
            </Tr>
            <Tr>
              <Th>Notes</Th>
              <Td>
                <Textarea
                  variant='flushed'
                  rows={5}
                  w='full'
                  fontSize='sm'
                  readOnly
                >
                  {equipment?.notes}
                </Textarea>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
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

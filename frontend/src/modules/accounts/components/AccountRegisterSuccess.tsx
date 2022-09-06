import {
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { RegisterUserDTO } from 'generated-api';
import { useState } from 'react';
import { BiCheckCircle } from 'react-icons/bi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FormLayout } from '../../../shared/components/form';

interface AccountRegisterSuccessProps {
  registerDTO: RegisterUserDTO | undefined;
  onClose: () => void;
  onRepeat: () => void;
}

export const AccountRegisterSuccess = ({
  registerDTO,
  onClose,
  onRepeat,
}: AccountRegisterSuccessProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <FormLayout>
        <Flex direction='column' gap={3}>
          <Icon as={BiCheckCircle} boxSize='2rem' color='green.500' />
          <Text>Email: {registerDTO?.email}</Text>
          <Text>Name: {registerDTO?.name}</Text>
          <Text>Roles: {registerDTO?.roles.join(', ')}</Text>
          <Text>Password: </Text>
          <InputGroup>
            <InputRightElement
              alignItems='center'
              justifyContent='center'
              h={10}
              px='4'
            >
              <IconButton
                aria-label='Show password'
                size='sm'
                variant='ghost'
                icon={showPassword ? <FaEye /> : <FaEyeSlash />}
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>

            <Input
              name='password'
              type={showPassword ? 'text' : 'password'}
              id='password'
              value={registerDTO?.password}
            />
          </InputGroup>
        </Flex>
      </FormLayout>
      <Flex>
        <Spacer />
        <Button onClick={onClose} data-cy='close-btn'>
          Close
        </Button>
        <Button variant='solid' onClick={onRepeat} ml={2}>
          Register Again
        </Button>
      </Flex>
    </>
  );
};

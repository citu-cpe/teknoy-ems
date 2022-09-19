import {
  InputGroup,
  InputRightElement,
  IconButton,
  Input,
} from '@chakra-ui/react';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordFieldProps {
  password: string;
}

export const PasswordField = ({ password }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
        value={password}
        borderBottom='0px'
      />
    </InputGroup>
  );
};

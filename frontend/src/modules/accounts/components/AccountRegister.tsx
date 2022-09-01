import { Flex, Heading, HStack, Input, Text } from '@chakra-ui/react';
import { RegisterUserDTO } from 'generated-api';
import { useState } from 'react';
import { LinkButton } from '../../../shared/components/elements';
import { MainLayout } from '../../../shared/components/layout';
import { AccountRegisterForm } from './AccountRegisterForm';

export const AccountRegister = () => {
  const [registerDTO, setRegisterDTO] = useState<RegisterUserDTO | undefined>(
    undefined
  );

  const handleComplete = (registeredDTO: RegisterUserDTO) => {
    setRegisterDTO(registeredDTO);
  };

  return (
    <MainLayout>
      {registerDTO ? (
        <Flex direction='column' gap={10} maxW='md' mx='auto'>
          <Heading mb={2}>Register Success</Heading>
          <Flex direction='column' gap={3}>
            <Flex direction='column' gap={1}>
              <Text>Email</Text>
              <Input readOnly type='text' value={registerDTO?.email} />
            </Flex>
            <Flex direction='column' gap={1}>
              <Text>Name</Text>
              <Input readOnly type='text' value={registerDTO?.name} />
            </Flex>
            <Flex direction='column' gap={1}>
              <Text>Roles</Text>
              <Input
                readOnly
                type='text'
                value={registerDTO?.roles.join(', ')}
              />
            </Flex>
            <Flex direction='column' gap={1}>
              <Text>Password</Text>
              <Input readOnly type='text' value={registerDTO?.password} />
            </Flex>
          </Flex>
          <HStack>
            <LinkButton label='Back to Accounts' route='/accounts' />
            <LinkButton
              variant='solid'
              label='Register Again'
              route='/accounts/register'
            />
          </HStack>
        </Flex>
      ) : (
        <AccountRegisterForm onComplete={handleComplete} />
      )}
    </MainLayout>
  );
};

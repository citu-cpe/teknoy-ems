import { Button, Center, Heading, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import { BiArrowBack } from 'react-icons/bi';
import { ContentSection } from '../../../shared/components/content';
import { LoginForm } from './LoginForm';

export const Login = () => {
  const router = useRouter();

  return (
    <Center flexDir='column' w='100%' h='100vh' gap={3}>
      <Button
        leftIcon={<Icon as={BiArrowBack} mr={2} my={0} py={0} h='100%' />}
        color='current'
        position='absolute'
        top={4}
        left={4}
        onClick={() => router.push('/')}
      >
        Home
      </Button>

      <Heading>Log in</Heading>
      <ContentSection minW='lg'>
        <LoginForm />
      </ContentSection>
    </Center>
  );
};

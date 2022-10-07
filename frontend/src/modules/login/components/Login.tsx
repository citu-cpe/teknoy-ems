import { Button, Center, Flex, Heading, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';
import { authPage } from '../../../shared/schemas';
import { LoginForm } from './LoginForm';

export const Login = () => {
  const router = useRouter();

  return (
    <Flex>
      <Flex minH='100vh' h='100vh' w='full'>
        <iframe
          src='https://my.spline.design/untitled-21a4629d1cd55f08a36901e930ddc246/'
          frameBorder='0'
          width='100%'
          height='100%'
        ></iframe>
      </Flex>
      <Center flexDir='column' w='70%' h='100vh' gap={3} bg='foreground'>
        <Button
          leftIcon={<Icon as={BiArrowBack} mr={2} my={0} py={0} h='100%' />}
          color='white'
          _hover={{
            bg: 'black',
            color: 'white',
          }}
          variant='outline'
          position='absolute'
          top={4}
          left={4}
          onClick={() => router.push('/')}
        >
          Home
        </Button>
        <Flex direction='column' justify='center' alignItems='center' h='full'>
          <Heading mb={20}>Login</Heading>
          <LoginForm />
        </Flex>
      </Center>
    </Flex>
  );
};

Login.auth = authPage;

import { Button, Center, Flex, Heading, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';
import { ThemeModeToggleFloat } from '../../../shared/components/header';
import { authPage } from '../../../shared/schemas';
import { LoginForm } from './LoginForm';

export const Login = () => {
  const router = useRouter();

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      justifyContent='center'
      alignItems='center'
    >
      <Flex
        minH='100vh'
        h='100vh'
        w='full'
        display={{ base: 'none', lg: 'block' }}
        visibility={{ base: 'hidden', lg: 'visible' }}
      >
        <iframe
          src='https://my.spline.design/untitled-398e61d4a5cd88c5a949f8f0f7e86f9b/'
          frameBorder='0'
          width='100%'
          height='100%'
        ></iframe>
      </Flex>
      <Center
        flexDir='column'
        w={{ base: 'full', lg: '70%' }}
        h='100vh'
        gap={3}
        bg='foreground'
        p={3}
      >
        <Flex direction='column' justify='center' alignItems='center' h='full'>
          <Heading mb={20}>Login</Heading>
          <LoginForm />
        </Flex>

        <Button
          leftIcon={<Icon as={BiArrowBack} mr={2} my={0} py={0} h='100%' />}
          color={{ base: 'current', lg: 'white' }}
          _hover={{
            lg: {
              bg: 'black',
              color: 'white',
            },
          }}
          variant='outline'
          position='absolute'
          top={4}
          left={4}
          onClick={() => router.push('/')}
        >
          Home
        </Button>
        <ThemeModeToggleFloat />
      </Center>
    </Flex>
  );
};

Login.auth = authPage;

import { Button, Center, Flex, Heading } from '@chakra-ui/react';
import NextLink from 'next/link';

export const Landing = () => {
  return (
    <Center w='100%' h='100vh' flexDir='column'>
      <Flex direction='column' alignItems='center' as='nav' gap={3}>
        <Heading>Teknoy EMS</Heading>
        <NextLink href='/login' passHref>
          <Button variant='solid' minW={56}>
            Log In
          </Button>
        </NextLink>
      </Flex>
    </Center>
  );
};

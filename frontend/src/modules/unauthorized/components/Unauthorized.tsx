import { Button, Center } from '@chakra-ui/react';
import { useRouter } from 'next/router';

export const Unauthorized = () => {
  const router = useRouter();

  return (
    <Center flexDir='column' w='100%' h='100vh' gap={3}>
      <Center>Sorry, the page you are trying to access is unauthorized.</Center>
      <Button onClick={() => router.back()}>Go Back</Button>
    </Center>
  );
};

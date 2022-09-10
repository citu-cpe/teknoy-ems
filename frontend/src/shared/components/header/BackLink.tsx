import { Button, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

export const BackLink = () => {
  const router = useRouter();

  return (
    <Button
      variant='ghost'
      leftIcon={<Icon as={BiArrowBack} mr={2} my={0} py={0} h='100%' />}
      p={0}
      m={0}
      size='sm'
      color='current'
      fontWeight='normal'
      _hover={{ textDecoration: 'none', bg: 'none', color: 'brand.500' }}
      _active={{ textDecoration: 'none', bg: 'none', color: 'brand.500' }}
      onClick={() => router.back()}
    >
      Back
    </Button>
  );
};

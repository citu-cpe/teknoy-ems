import { Button, ButtonProps, Icon } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { BiArrowBack } from 'react-icons/bi';

export const BackButton = ({ children = 'Back', ...props }: ButtonProps) => {
  const nextRouter = useRouter();

  return (
    <Button
      opacity={0.8}
      _hover={{
        opacity: 1,
      }}
      leftIcon={<Icon as={BiArrowBack} mr={2} my={0} py={0} h='100%' />}
      color='current'
      position='absolute'
      onClick={() => nextRouter.back()}
      top={4}
      left={4}
      {...props}
    >
      {children}
    </Button>
  );
};

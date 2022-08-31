import { Flex } from '@chakra-ui/react';

export const ContentLayout = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  return (
    <Flex
      direction='column'
      minH='100vh'
      w={{ base: '100%', md: 'auto' }}
      p={{ base: 5, md: 10 }}
      gap={6}
    >
      {children}
    </Flex>
  );
};

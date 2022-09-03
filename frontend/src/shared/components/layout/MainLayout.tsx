import { Flex, FlexProps } from '@chakra-ui/react';
import { Header } from '../header/Header';

export const MainLayout = ({
  children,
  ...props
}: React.PropsWithChildren<unknown> & FlexProps) => {
  return (
    <Flex
      direction='column'
      minH='100vh'
      maxW='container.lg'
      mx='auto'
      w={{ base: '100%', md: 'auto' }}
      p={{ base: 5, md: 10 }}
      gap={6}
      {...props}
    >
      <Header />
      {children}
    </Flex>
  );
};

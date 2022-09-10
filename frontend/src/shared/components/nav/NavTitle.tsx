import { Text } from '@chakra-ui/react';

interface NavTitleProps {
  children: React.ReactNode;
}

export const NavTitle = ({ children }: NavTitleProps) => {
  return (
    <Text
      fontSize='10'
      ml={4}
      mt={4}
      mb={1}
      letterSpacing='wide'
      fontWeight='bold'
      textTransform='uppercase'
    >
      {children}
    </Text>
  );
};

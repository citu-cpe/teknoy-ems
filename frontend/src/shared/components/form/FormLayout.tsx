import { Flex, FlexProps } from '@chakra-ui/react';

interface ContentSectionProps {
  children: React.ReactNode;
}

export const FormLayout = ({
  children,
  ...props
}: ContentSectionProps & FlexProps) => {
  return (
    <Flex
      direction='column'
      bg='foreground'
      borderWidth='1px'
      rounded='xl'
      px={6}
      py={5}
      mb={4}
      gap={5}
      {...props}
    >
      {children}
    </Flex>
  );
};
